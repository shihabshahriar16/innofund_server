const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const router = express.Router();
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login'); // Load User model

router.post('/register', async (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return next(errors);
  }
  passport.authenticate('register', async (err, user, info) => {
    try {
      if (err || !user) {
        console.log(info);
        return res.status(400).json(info);
      }
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerify: user.emailVerify,
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.post('/login', async (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body); // Check validation
  if (!isValid) {
    return next(errors);
  }
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        console.log(info);
        return res.status(400).json(info);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        //console.log(user)
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerify: user.emailVerify,
        }; // Sign token
        const token = jwt.sign(payload, process.env.secretOrKey, {
          expiresIn: 2678400 /* 1 month in seconds*/,
        });
        return res.json({ success: true, token: token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    //We'll just send back the user details and the token
    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      token: req.query.secret_token,
    });
  }
);

module.exports = router;
