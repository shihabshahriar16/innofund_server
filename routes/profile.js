const express = require('express');
const passport = require('passport');
const { v4: uuid } = require('uuid');
const router = express.Router();

const User = require('../models/User');
const Project = require('../models/Project');
const ProjectInvestor = require('../models/ProjectInvestor');

// @route   GET api/profile/me
// @desc    get current user's profile
// @access  private
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),

  async (req, res,next) => {
      try {
          const profile = await User.getUserById(req.user.id)
          const {name,email,organization,position} = profile[0]
          const profileToBePassed = {name,email,organization,position}
          res.json(profileToBePassed)
      } catch (error) {
          console.error(error)
          res.status(500).send('server error')
      }
  }
);

// @route   POST api/profile
// @desc    create or update profile
// @access  private

module.exports = router;
