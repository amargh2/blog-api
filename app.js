//require libraries

//env initilize
require('dotenv').config();
const localStrategy = require('./auth').localStrategy
const jwtStrategy = require('./auth').jwtStrategy

const bodyParser = require('body-parser');

//mongoose stuff
const User = require('./models/user');
const Post = require('./models/post')
const mongoose = require('mongoose')

const auth = require('./auth');
const morgan = require('morgan');

//Express instantiation
const express = require('express');
const app = express();


//passport and JWT authentication stuff
const passport = require("passport");
const LocalStrategy = require('passport-local');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

//set up express behavior
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(express.static(__dirname + '/public'));

//logging with morgan
app.use(morgan('dev'))

//connect to database
mongoose.connect(process.env.MONGO_URI)

// Passport local strategy
passport.use('local', localStrategy)

// JWT strategy - options are passed, followed by the verify function (done)
passport.use('jwt', jwtStrategy)


/*app.post('/login', async(req, res) => {
  try {
    const user = mongoose.connect(process.env.MONGO_URI) && await User.findOne({username:'ideogesis'})
    const username = req.body.username;
    const password = req.body.password;
    //check username and password, and if correct, pass a token to the user; else return error
    if (username === user.username && await bcrypt.compare(password, user.password)
      .then(res => res) === true) {
        const opts = {};
        const token = jwt.sign({username: username, id:user.id}, process.env.ACCESS_TOKEN_SECRET, opts)
        return res.status(200).json({
          message:'Authorization passed.',
          token
        })
    } else {
      return res.status(401).json({message:'Authorization failed.'})
    }
  } catch (err) {
    res.json({error:err})
}
  
})*/


app.post('/login', passport.authenticate('local', {session:false, failureRedirect:'/', failureMessage:true}), async(req,res) => {
  try {
    const opts = {}
    const token = jwt.sign({username: req.username, 
      id:req.user.id}, 
      process.env.ACCESS_TOKEN_SECRET, 
      opts)
    console.log(token)
    return res.json({message:'Authorization successful', token})
  } catch (error) {
    return res.json({error: error.message})
  }
})



//just a verification of the jwt auth strategy
app.get('/secretpage', passport.authenticate('jwt', {session:false}), (req, res) => {
  res.json({message: "Welcome to the jungle. There's fun. There's games."})
})

//POST a new post
app.post('/posts/new', passport.authenticate('jwt', {session:false}), async (req, res) => {
  try {
    const post = new Post({
      author: await User.findOne({username:'ideogesis'}),
      date: new Date(),
      subject: req.body.subject,
      message: req.body.message,
    })
    await post.save()
    res.json({message:'Post added.'})
  } catch (error) {
    res.json({error})
  }
})


//GET ALL posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find({}).sort({date:-1})
    res.json({posts})
  } catch (error) {
    res.json({error})
  }
})

//GET specific post by id
app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    res.json({post})
  } catch (error) {
    res.json({error})
  }
})

//GET the index, which is currently a check for that the api is sending JSON
app.get('/', (req, res) => res.json({message:'Welcome to the API.'}))

app.listen(3000, ()=> console.log('Server listening on port 3000.'))