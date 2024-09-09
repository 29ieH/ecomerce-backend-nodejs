'use strict'
const express = require('express')
const router = express.Router();

router.use('/api/v1',require('./access'))
// router.get('/',(req,res,next) => {
//     return res.status(200).json({
//         message:"Welcome 29ieh Page"
//     })
// })
module.exports = router;
