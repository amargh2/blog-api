//Auth strategies - local auth with JWT's for protected routes/endpoints
const passport = require("passport");
const LocalStrategy = require('passport-local');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Post = require('./models/post')
const mongoose = require('mongoose')
const User = require('./models/user')

exports.localStrategy = new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, async function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (await bcrypt.compare(password, user.password) === false) return done(null, false);
      if (await bcrypt.compare(password, user.password) === true) return done(null, user);
      else return done(null, false)
  });
  }
)

exports.jwtStrategy = new JWTStrategy(
  {secretOrKey:process.env.ACCESS_TOKEN_SECRET, 
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken()},
  async (jwt_payload, done) => {
    try {
      const user = mongoose.connect(process.env.MONGO_URI) && await User.findById(jwt_payload.id);
      user ? done(null, user) : done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }
);