//require libraries
require('dotenv').config();
const bcrypt = require('bcryptjs');
const post = require('./routes/post');
const bodyParser = require('body-parser');
const User = require('./models/user');
const mongoose = require('mongoose')
const auth = require('./auth');
const morgan = require('morgan');
//Express instantiation
const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt
app.use(morgan('dev'))

//passport stuff
const passport = require("passport");
const LocalStrategy = require('passport-local');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(passport.initialize())

app.use(express.static(__dirname + '/public'));


passport.use(new LocalStrategy( 'local',
  {session:false},
  async (username, password, done) => {
    try {
      //find user. terminate if no user is found.
      const user = User.findOne({username})
      if (!user) done(null, false, {message:'User not found.'})
      //validate will be a true or false value; 
      //the user model has a bulit in validator with bcrypt
      const validate = await user.isValidPassword(password)
      if (!validate) done(null, false, {message:'Incorrect password.'})
      //Success, return the user and login message.
      return done(null, user, {message:'Logged in successfully.'})
    } catch (error) {
      return done(error)
    }
  }
))

passport.use(new JWTStrategy(
  {secretOrKey:process.env.ACCESS_TOKEN_SECRET, 
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken()},
  async (jwt_payload, done) => {
    try {
      console.log(jwt_payload)
      const user = await User.findOne({username: jwt_payload.username});
      user ? done(null, user) : done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }
));


app.use('/post', post)
app.post('/login', async(req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URI)
    const user = await User.findOne({username:'ideogesis'})
    const username = req.body.username;
    const password = req.body.password;
    if (username === user.username) {
      if (await bcrypt.compare(password, user.password).then(res => res) === true) {
        console.log(username)
        const opts = {};
        const token = await jwt.sign({username: username, id:user.id}, process.env.ACCESS_TOKEN_SECRET, opts)
        console.log('the token: ' + token + 'the token username: ' + token.username)
        return res.status(200).json({
          message:'Authorization passed.',
          token
        })
      }
    } else {
      return res.status(401).json({message:'Authorization failed.'})
    }
} catch (err) {
  res.json({message:'Something went wrong.'})
}
  
})




app.get('/secretpage', passport.authenticate('jwt', {session:false}), (req, res) => {
  res.json({message: 'Welcome to the jungle.'})
})

app.get('/', (req, res) => res.json({message:'Welcome to the API.'}))

app.listen(3000, ()=> console.log('Server listening on port 3000.'))