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
    .sort({ date: 'desc' })
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
    .populate('comments.commentUser')
    .then(story => {
      if (story.status == 'public') {
        res.render('stories/show', {
          story: story
        });
      } else {
        if (req.user) {
          if (req.user.id == story.user._id) {
            res.render('stories/show', {
              story: story
            });
          } else {
            res.redirect('/stories');
          }
        } else {
          res.redirect('/stories');
        }
      }
    });
});

// GET USER STORIES
router.get('/user/:userId', (req, res) => {
  Story.find({
    user: req.params.userId,
    status: 'public'
  })
    .populate('user')
    .then(stories => {
      res.render('stories/index', { stories: stories });
    });
});

// GET MY STORIES
router.get('/my', ensureAuth, (req, res) => {
  Story.find({
    user: req.user.id
  })
    .populate('user')
    .then(stories => {
      res.render('stories/index', { stories: stories });
    });
});

router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add');
});

router.get('/edit/:id', ensureAuth, (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      res.render('stories/edit', {
        story: story
      });
    }
  });
});

router.post('/', (req, res) => {
  const { title, body, status } = req.body;

  let allowComments;
  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newStory = {
    title: title,
    body: body,
    status: status,
    allowComments: allowComments,
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
    let allowComments;
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    story.title = title;
    story.body = body;
    story.status = status;
    allowComments = allowComments;

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

// ADD COMMENT
router.post('/comment/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    const newComment = {
      commentsBody: req.body.commentsBody,
      commentUser: req.user.id
    };

    story.comments.unshift(newComment);
    story.save().then(story => {
      console.log(story.comments);
      res.redirect(`/stories/show/${story.id}`);
    });
  });
});

module.exports = router;
