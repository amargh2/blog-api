const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt =  require('bcryptjs')
const passportLocalMongoose = require('passport-local-mongoose');

const User =  new Schema({
  first_name: String,
  last_name: String,
  username: String,
  password: String
})

User.methods.verifyPassword = async function(password) {
    const user = this
    const compare = await bcrypt.compare(password, user.password)
    return compare
}


module.exports = mongoose.model('User', User)