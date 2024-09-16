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
const { countConnect } = require('./helpers/check.connect')
countConnect();
// Init routes
app.use('/',require('./routes/index'))
// Handling Error
app.use((req,res,next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
app.use((error,req,res,next) => {
    console.log("Error nhảy vào đây ?.? ")
    const errorCode = error.status || 500;
    return res.status(errorCode).json({
        status:'error',
        code:errorCode,
        message:error.message || 'Interval Server'
    })
})
module.exports = app;