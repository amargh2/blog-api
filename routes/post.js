const express = require('express');
const router = express.Router();
const Post = require('../models/post')
const mongoose = require('mongoose')
//connect to database
router.use((req, res, next) => {
  mongoose.connect(process.env.MONGO_URI);
  next()
})

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({}).sort({date:-1})
    res.json({message:'Picture it. Posts. Far as the eye can see.', posts})
  } catch (err) {
    res.json({message:'Could not find resource.'})
  }
})


module.exports = router