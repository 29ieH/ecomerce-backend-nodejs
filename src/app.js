const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();

// Init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
// Init db

// Init routes
app.get('/',(req,res,next) => {
    res.status(200).json({
        message:'Welcome 29ieH'
    })
})
// Handling Error

module.exports = app;