if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
const users = require("./routes/users");
require('./auth/auth');


app.use(cors());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use("/api", users);

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true,  useCreateIndex: true, useFindAndModify: false})
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open',() => console.log('Connected to Mongoose! Database is up!!'))

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json(err);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));