const mongoose = require('mongoose')
const User = require('./models/user')
require('dotenv').config()
const bcrypt = require('bcryptjs')

const addUser = async () => {
  mongoose.connect(process.env.MONGO_URI)
  const hash = await bcrypt.hash(process.env.pw, 8)
  const user = new User({
    first_name: 'Anthony',
    last_name: 'Margherio',
    username: 'ideogesis',
    password: hash
  })
  await user.save()
  console.log('user added')
}

addUser()