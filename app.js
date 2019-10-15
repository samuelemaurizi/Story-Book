const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

require('dotenv').config();
require('./config/passport')(passport);
const auth = require('./routes/auth');

const app = express();

// Routes
app.get('/', (req, res) => {
  res.send('Connected!');
});

app.use('/auth', auth);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started om port ${port}...`));
