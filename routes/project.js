const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Project = require('../models/Project');
const Comment = require('../models/Comment');
//const { post } = require('./users');

const validateCommentInput = require('../validation/comment');
//  @route GET api/project
//  @desc get all projects
//  @access public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.getAllProjects();
    res.json(projects[0]);
  } catch (error) {
    res.status(500).send('server error');
  }
});

//  @route GET api/project/:id
//  @desc get project by id
//  @access public

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.getProjectById(req.params.id);
    if (!project[0].length) {
      return res.status(400).json({ msg: 'no project found' });
    }

    res.json(project[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error');
  }
});

//  @route POST api/project/create
//  @desc create a new campaign/project
//  @access private

router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      let {
        project_name,
        project_description,
        project_location,
        start_date,
        end_date,
        goal,
      } = req.body;

      start_date = new Date(start_date);
      end_date = new Date(end_date);

      const user_account_id = req.user.id;

      let newProject = {
        project_name,
        user_account_id,
        project_description,
        project_location,
        start_date,
        end_date,
        goal,
      };

      await Project.createNewProject(newProject);
      res.json({ msg: 'created a new project' });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('server error');
    }
  }
);

//  @route POST api/project/comment/:id
//  @desc comment on a project
//  @access private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const project = await Project.getProjectById(req.params.id);
    if (!project[0].length) {
      return res.status(400).json({ msg: 'no project found' });
    }
    const { errors, isValid } = validateCommentInput(req.body);
    // Check validation
    if (!isValid) {
      return next(errors);
    }

    try {
      let newComment = {
        project_id: req.params.id,
        user_account_id: req.user.id,
        comment_text: req.body.comment_text,
      };
      await Comment.AddCommentToPost(newComment);
      res.json({ msg: 'comment added' });
    } catch (error) {
      console.error(error);
      res.status(500).send('server error');
    }
  }
);
module.exports = router;
