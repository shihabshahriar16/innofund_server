const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

const Project = require('../models/Project')

//  @route GET api/project
//  @desc get all projects
//  @access public
router.get('/',async(req,res)=>{
    try {
        const projects = await Project.getAllProjects()
        res.json(projects[0])

    } catch (error) {
        res.status(500).send('server error')
    }
})

module.exports = router