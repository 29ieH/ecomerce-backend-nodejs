'use strict'
const express = require('express')
const router = express.Router();
const {validApiKey,checkPermission} = require('../auth/apiKeyUtils')
const ver = '/api/v1';
router.use(`${ver}/redis`,require('./redis'))
// Check api-key
router.use(validApiKey)
router.use(checkPermission('0000'))
router.use(`${ver}/product`,require('./product'))
router.use(`${ver}/comment`,require('./comment'))
router.use(`${ver}/order`,require('./order'))
router.use(`${ver}/inventory`,require('./inventory'))
router.use(`${ver}/user`,require('./user'))
router.use(`${ver}/permission`,require('./permission'))
router.use(`${ver}/role`,require('./role'))
router.use(`${ver}/checkout`,require('./checkout'))
router.use(`${ver}/cart`,require('./cart'))
router.use(`${ver}/access`,require('./access'))
router.use(`${ver}/discount`,require('./discount.js'))

// router.get('/',(req,res,next) => {
//     return res.status(200).json({
//         message:"Welcome 29ieh Page"
//     })
// })
module.exports = router;
