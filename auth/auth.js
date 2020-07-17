const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const DB = require('../config/connectDB')


//Create a passport middleware to handle user registration
passport.use('register', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        console.log("User Registering: " + email);
        const name = req.body.name;
        const organization = req.body.organization;
        const position = req.body.position;
        //Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
      //your application becomes.
      const hash = await bcrypt.hash(password, 10);
      password = hash;
        const sqlData = {
            name: name,
            email: email,
            password: password,
            organization: organization,
            position: position
        }
        //console.log(sqlData)
        //Save the information provided by the user to the the database
        const feedback = await DB.pool.query("INSERT INTO user SET ?", sqlData);
        console.log(feedback);
        const user = await DB.pool.query("select * from user where email = ?", email);
        console.log(user[0][0]);
        //Send the user information to the next middleware
        return done(null, user[0][0]);
    } catch (error) {
        console.log(error)
        if(error.errno ===1062){
            done(null, false, { email: "email already exists" });
        } else{
            done(null, false, { email: error.message });
        }
    }
}));

//Create a passport middleware to handle User login
passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await DB.pool.query("SELECT * FROM user WHERE email = ?", email)
        if (!user[0][0]) {
            return done(null, false, { emailnotfound: "Email not found" });
        }
        const validate = await bcrypt.compare(password,user[0][0].password);
        if (!validate) {
            return done(null, false, { passwordincorrect: "Password incorrect" });
        }
        return done(null, user[0][0], { message: 'Logged in Successfully' });
    } catch (error) {
        return done(error);
    }
}));

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use('jwt', new JWTstrategy({
    //secret we used to sign our JWT
    secretOrKey: process.env.secretOrKey,
    //we expect the user to send the token as a query parameter with the name 'secret_token'
    jwtFromRequest: ExtractJWT.fromHeader('authorization')
}, async (token, done) => {
    try {
        //console.log(token)
        //Pass the user details to the next middleware
        return done(null, token);
    } catch (error) {
        //console.log(error)
        done(error);
    }
}));
