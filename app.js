const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require('./models/User');
require('./models/Story');

require('dotenv').config();
require('./config/passport')(passport);

const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require('./helpers/hbs');

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
// Handlebars
app.engine(
  'handlebars',
  exphbs({
    helpers: {
      truncate: truncate,
      stripTags: stripTags,
      formatDate: formatDate,
      select: select,
      editIcon: editIcon
    },
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

// Method Override
app.use(methodOverride('_method'));

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

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
  res.locals.fullYear = new Date().getFullYear();
  next();
});

/////////////////////////////
// Routes
/////////////////////////////
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started om port ${port}...`));
