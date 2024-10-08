'use strict'
const express = require('express');
const userController = require('../../controllers/userController');
const { asyncHandler } = require('../../helpers/handleUtils');
const { authentication, authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();
router.use(authenticationV2)
router.post('/registed-shop',asyncHandler(userController.registedToShop))
module.exports = router;
