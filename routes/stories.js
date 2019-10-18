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

router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .populate('user')
    .then(story => {
      res.render('stories/show', {
        story: story
      });
    });
});

router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add');
});

router.get('/edit/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    res.render('stories/edit', {
      story: story
    });
  });
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
      console.log(story);
      res.redirect(`/stories/show/${story.id}`);
    })
    .catch(err => console.log(err));
});

router.put('/:id', ensureAuth, (req, res) => {
  const { title, body, status } = req.body;

  Story.findOne({
    _id: req.params.id
  }).then(story => {
    let allowComment;
    if (req.body.allowComment) {
      allowComment = true;
    } else {
      allowComment = false;
    }

    story.title = title;
    story.body = body;
    story.status = status;
    allowComment = allowComment;

    story.save().then(story => {
      res.redirect('/dashboard');
    });
  });
});

router.delete('/:id', ensureAuth, (req, res) => {
  Story.deleteOne({
    _id: req.params.id
  }).then(() => {
    console.log(req.params.id);
    res.redirect('/dashboard');
  });
});

module.exports = router;
