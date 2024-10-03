'use strict'
const express = require('express');
const checkoutController = require('../../controllers/checkoutController');
const {asyncHandler} = require('../../helpers/handleUtils');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();
router.use(authenticationV2)
router.post('/review',asyncHandler(checkoutController.review))
module.exports = router;
