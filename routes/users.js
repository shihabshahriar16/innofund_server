const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const axios = require('axios')
const SSLCommerz = require('sslcommerz-nodejs');
let sslsettings = {
    isSandboxMode: true, //false if live version
    store_id: "kerne5eecca7eecc59",
    store_passwd: "kerne5eecca7eecc59@ssl"
}

const router = express.Router();
const validateRegisterInput = require("../validation/studentRegister");
const validateLoginInput = require("../validation/login");// Load User model
const LiveClassModel = require("../models/LiveClass")
const StudentModel = require('../models/Student');

router.post('/register', async (req, res, next) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return next(errors);
    }
    passport.authenticate('register', async (err, user, info) => {
        try {
            if (err || !user) {
                console.log(info)
                return res.status(400).json(info)
            }
            return res.json({ id: user.id, name: user.name, email: user.email, emailVerify: user.emailVerify, type: "student" })
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});


router.post('/login', async (req, res, next) => {
    const { errors, isValid } = validateLoginInput(req.body);// Check validation
    if (!isValid) {
        return next(errors);
    }
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err || !user) {
                console.log(info)
                return res.status(400).json(info)
            }
            req.login(user, { session: false }, async (error) => {
                if (error) return next(error)
                //We don't want to store the sensitive information such as the
                //user password in the token so we pick only the email and id
                //console.log(user)
                const payload = { id: user.id, name: user.name, email: user.email, emailVerify: user.emailVerify, type: "student" };// Sign token
                const token = jwt.sign(payload, process.env.secretOrKey, { expiresIn: 2678400 /* 1 month in seconds*/ });
                return res.json({ success: true, token: token });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    //We'll just send back the user details and the token
    res.json({
        message: 'You made it to the secure route',
        user: req.user,
        token: req.query.secret_token
    })
});


router.get('/approvedliveclass', async (req, res, next) => {
    try {
        const liveClass = await LiveClassModel.find({ approved: true })
        //console.log(liveClass)
        res.json(liveClass)
    }
    catch (err) {
        console.log(err)
        return next(err);
    }
});

router.post('/registerliveclass/:studentid/:classid', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const participants = {
            studentId: req.params.studentid
        }

        const targetLiveClass = await LiveClassModel.findOne({ _id: req.params.classid })

        const targetStudent = await StudentModel.findOne({ _id: req.params.studentid })

        if (await LiveClassModel.findOne({ _id: req.params.classid, "participants.studentId": req.params.studentid })) {
            res.json({ message: 'Already registered', success: true })
        } else if (targetLiveClass.class_type === 'Paid') {
            let sslcommerz = new SSLCommerz(sslsettings);
            let post_body = {};
            post_body['total_amount'] = targetLiveClass.price;
            post_body['currency'] = "BDT";
            post_body['tran_id'] = `${req.params.studentid + req.params.classid + Date.now()}`;
            post_body['success_url'] = "https://www.coursebee.com/success";
            post_body['fail_url'] = "https://www.coursebee.com/failed";
            post_body['cancel_url'] = "https://www.coursebee.com/cancel";
            post_body['emi_option'] = 0;
            post_body['cus_add1'] = "n/a";
            post_body['cus_name'] = `${targetStudent.name}`;
            post_body['cus_email'] = `${targetStudent.email}`;
            post_body['cus_phone'] = `${req.body.phone}`;
            post_body['cus_city'] = `${req.body.city}`;
            post_body['cus_country'] = `${req.body.country}`;
            post_body['shipping_method'] = "NO";
            post_body['num_of_item'] = 1;
            post_body['product_name'] = `${targetLiveClass.topic}`;
            post_body['product_category'] = "Live Class Registration";
            post_body['product_profile'] = "non-physical-goods";
            post_body['value_a'] = req.params.studentid;
            post_body['value_b'] = req.params.classid;
            const transaction = await sslcommerz.init_transaction(post_body)
            if (transaction.GatewayPageURL && transaction.GatewayPageURL !== "") {
                res.json({ status: 'success', data: transaction.GatewayPageURL, logo: transaction.storeLogo })
            } else {
                res.json({ status: 'fail', data: null, logo: transaction.storeLogo, message: "JSON Data parsing error!" })
            }
        } else {
            await LiveClassModel.updateOne({ _id: req.params.classid }, { $push: { participants: participants } })
            res.json({ message: 'Successfully registered', success: true })
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.get('/myliveclass/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const myliveclasses = await LiveClassModel.find({ "participants.studentId": req.params.id })
        res.json(myliveclasses)
    }
    catch (err) {
        next(err)
    }
})

router.get('/joinliveclass/:studentid/:classid', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {

        const found = await LiveClassModel.findOne({ _id: req.params.classid, "participants.studentId": req.params.studentid })
        if (!found) res.json({ message: "Not Authorized", success: false })
        else if (new Date(found.start_time) > new Date()) res.json({ message: "Please Wait Until Scheduled Time", success: false })
        else res.json({ message: 'Authization Complete', success: true })
    }
    catch (err) {
        next(err)
    }
});

router.post('/ipn_listener', async (req, res) => {
    try {
        let sslcommerz = new SSLCommerz(sslsettings);
        const validation = await sslcommerz.validate_transaction_order(req.body.val_id)
        //console.log(validation)
        if (validation.status === "VALID") {
            const participants = {
                studentId: validation.value_a,
                transaction: validation.tran_id
            }
            await LiveClassModel.updateOne({ _id: validation.value_b }, { $push: { participants: participants } })
            res.json({ message: 'Successfully registered', success: true })
        }
    }
    catch (err) {
        console.log(err)
        next(err)
    }
})

module.exports = router;