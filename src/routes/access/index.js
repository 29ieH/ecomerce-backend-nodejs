'use strict'
const express = require('express');
const accessController = require('../../controllers/accessController');
const {asyncHandler} = require('../../helpers/handleUtils');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();
router.post('/shop/login',asyncHandler(accessController.login))
router.post('/shop/signup',asyncHandler(accessController.signUp))
router.use(authentication)
router.post('/shop/logout',asyncHandler(accessController.logout))
router.post('/shop/handleRefreshToken',asyncHandler(accessController.handleToken))
module.exports = router;
