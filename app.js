const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require('./models/User');
require('dotenv').config();
require('./config/passport')(passport);
const auth = require('./routes/auth');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

const app = express();

/////////////////////////////
// MIDDLEWARES
/////////////////////////////
// Cookie Parser
app.use(cookieParser());

// Express Session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

/////////////////////////////
// Routes
/////////////////////////////
app.get('/', (req, res) => {
  res.send('Connected!');
});

app.use('/auth', auth);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started om port ${port}...`));
