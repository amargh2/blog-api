const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
  author: String,
  date: Date,
  message: String
})