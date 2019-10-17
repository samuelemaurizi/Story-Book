const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Models
const Story = mongoose.model('stories');
const User = mongoose.model('users');

const { ensureAuth, ensureGuest } = require('../helpers/auth');

router.get('/', (req, res) => {
  Story.find({ status: 'public' })
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      });
    });
});

router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add');
});

router.post('/', (req, res) => {
  const { title, body, status } = req.body;

  let allowComment;
  if (req.body.allowComment) {
    allowComment = true;
  } else {
    allowComment = false;
  }

  const newStory = {
    title: title,
    body: body,
    status: status,
    allowComment: allowComment,
    user: req.user.id
  };

  new Story(newStory)
    .save()
    .then(story => {
      // res.redirect(`/stories/show/${story.id}`);
      console.log(story);
      res.redirect('/');
    })
    .catch(err => console.log(err));
});

module.exports = router;
