const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
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

    if (!project[0]) {
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
      let newProject = {
        id: uuidv4(),
        created_by_id: req.user.id,
        project_name: req.body.project_name,
        project_type: req.body.project_type,
        project_description: req.body.project_description,
        start_date: new Date(req.body.start_date),
        end_date: new Date(req.body.end_date),
        goal: req.body.goal,
        //project_status_id:uuidv4(),
        //project_video_url:req.body.project_video_url
      };

      await Project.createNewProject(newProject, next);
      res.json({ msg: 'created a new project' });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('server error');
    }
  }
);
//  @route POST api/project/:id
//  @desc delete a project
//  @access private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const project = await Project.getProjectById(req.params.id);

    if (!project[0]) {
      return res.status(400).json({ msg: 'no project found' });
    }

    if (req.user.id !== project[0].user_account_id) {
      return res.status(401).json({ msg: 'user not authorized' });
    }
    try {
      await Project.DeleteProjectById(req.params.id);
      res.json({ msg: 'project deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('server error');
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
    if (!project[0]) {
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

//  @route POST api/project/comment/:id
//  @desc delete a comment on a project
//  @access private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const comment = await Comment.GetCommentById(
      req.params.comment_id,
      req.params.id
    );

    if (!comment[0]) {
      return res.status(400).json({ msg: 'no comment found' });
    }

    if (req.user.id !== comment[0].user_account_id) {
      return res.status(401).json({ msg: 'user not authorized' });
    }
    try {
      await Comment.DeleteCommentById(req.params.comment_id, req.params.id);
      res.json({ msg: 'comment deleted successfully' });
    } catch (error) {
      res.status(500).send('server error');
    }
  }
);

//  @route GET api/project/myprojects
//  @desc get user's projects
//  @access private

router.get(
  '/personal/all',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const myprojects = await Project.getProjectsByUserId(req.user.id);
      if (!myprojects[0]) {
        return res.status(400).json({ msg: 'you do not have any projects' });
      }
      res.json(myprojects[0]);
    } catch (error) {
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
