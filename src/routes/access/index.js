'use strict'
const express = require('express');
const accessController = require('../../controllers/accessController');
const {asyncHandler} = require('../../auth/handleUtils')
const router = express.Router();
router.post('/shop/login',asyncHandler(accessController.login))
router.post('/shop/signup',asyncHandler(accessController.signUp))
module.exports = router;
