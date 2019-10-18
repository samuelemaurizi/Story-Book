const express = require('express');
const mongoose = require('mongoose');

const router = express();

const Story = mongoose.model('stories');
const { ensureAuth, ensureGuest } = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
  res.render('index/welcome');
});

router.get('/about', (req, res) => {
  res.render('index/about');
});

router.get('/dashboard', ensureAuth, (req, res) => {
  Story.find({
    user: req.user.id
  }).then(stories => {
    res.render('index/dashboard', {
      stories: stories
    });
  });
});

module.exports = router;
