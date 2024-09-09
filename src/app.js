require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();
// Init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
// Init db
require('./dbs/init.mongodbfinal')
const { countConnect } = require('./helper/check.connect')
countConnect();
// Init routes
app.use('/',require('./routes/index'))
// Handling Error

module.exports = app;