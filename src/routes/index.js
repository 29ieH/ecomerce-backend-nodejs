'use strict'
const express = require('express')
const router = express.Router();
const {validApiKey,checkPermission} = require('../auth/apiKeyUtils')
const ver = '/api/v1';
// Check api-key
router.use(validApiKey)
router.use(checkPermission('0000'))
router.use(`${ver}/product`,require('./product'))
router.use(`${ver}/shop`,require('./access'))
router.use(`${ver}/discount`,require('./discount.js'))

// router.get('/',(req,res,next) => {
//     return res.status(200).json({
//         message:"Welcome 29ieh Page"
//     })
// })
module.exports = router;
