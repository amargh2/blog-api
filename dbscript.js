const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcryptjs')

const addMe = async () => {
  try {
    mongoose.connect("mongodb+srv://user:4N7IjMlId2Eb7EWE@cluster0.l4nn2b3.mongodb.net/?retryWrites=true&w=majority")
    const pw ="y?s[v+sGK<+C:'/BSu{H"
    const password = await bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(pw, salt))
      .then(password => password)
      .catch(err => err)
    console.log(password)
    const me = new User ({
      first_name: 'Anthony',
      last_name: 'Margherio',
      username: 'ideogesis',
      password: await password
    })
    await me.save()
    console.log('all done')
  } catch (err) {
    throw err
  }
}

const checkPassword = async () => {
  try {
    mongoose.connect("mongodb+srv://user:4N7IjMlId2Eb7EWE@cluster0.l4nn2b3.mongodb.net/?retryWrites=true&w=majority")
    const pw ="y?s[v+sGK<+C:'/BSu{H"
    const me = await User.findOne({username:'ideogesis'})
    console.log(me.password)
    console.log(await me.isValidPassword(pw))
  } catch (err) {
    throw err
  }
}

checkPassword()