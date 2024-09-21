'use strict'
const express = require('express')
const router = express.Router();
const {validApiKey,checkPermission} = require('../auth/apiKeyUtils')
// Check api-key
router.use(validApiKey)
router.use(checkPermission('0000'))
router.use('/api/v1',require('./product'))
router.use('/api/v1',require('./access'))
// router.get('/',(req,res,next) => {
//     return res.status(200).json({
//         message:"Welcome 29ieh Page"
//     })
// })
module.exports = router;
