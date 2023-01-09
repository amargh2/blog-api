// THIS IS THE ONE. THIS IS THE PASSPORT CONFIG.
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User= require('./models/user');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt

passport.use(new localStrategy( 'local',
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

/*passport.use(new JWTStrategy(
  {secretOrKey:process.env.ACCESS_TOKEN_SECRET, jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken},
  async (jwt_payload, done) => {
    try {
      const user = await User.findOne({id: jwt_payload.username});
      user ? done(null, user) : done(null, false);
    } catch (error) {
      return done(err, false);
    }
  }
));*/