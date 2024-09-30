'use strict'
const express = require('express');
const accessController = require('../../controllers/accessController');
const {asyncHandler} = require('../../helpers/handleUtils');
const { authentication,authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();
router.post('/login',asyncHandler(accessController.login))
router.post('/signup',asyncHandler(accessController.signUp))
router.use(authenticationV2)
router.post('/logout',asyncHandler(accessController.logout))
router.post('/handleRefreshToken',asyncHandler(accessController.handleToken))
module.exports = router;
