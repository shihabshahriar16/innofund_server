if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const util = require('util');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
const DB = require("./config/connectDB")
const UserSchema = require("./models/User")
const users = require("./routes/users");
require('./auth/auth');


app.use(cors());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

DB.testConnection()
UserSchema.CreateUserSchema();


app.use('/api',users);

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json(err);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));