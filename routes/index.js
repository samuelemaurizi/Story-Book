const express = require('express');
const router = express();

const { ensureAuth, ensureGuest } = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
  res.render('index/welcome');
});

router.get('/about', (req, res) => {
  res.render('index/about');
});

router.get('/dashboard', ensureAuth, (req, res) => {
  res.render('index/dashboard');
});

module.exports = router;
