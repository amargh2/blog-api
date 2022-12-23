//require libraries
require('dotenv').config();
const passport = require('passport');
const jwt = require('passport-jwt');

//Express stuff
const express = require('express')
const app = express()

app.get('/', (req, res) => res.json({message:'Welcome to the API.'}))

app.listen(3000, ()=> console.log('Server listening on port 3000.'))