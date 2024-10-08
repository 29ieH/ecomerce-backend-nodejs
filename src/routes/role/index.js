'use strict'
const express = require('express');
const roleController = require('../../controllers/roleController');
const {asyncHandler} = require('../../helpers/handleUtils');
const { authenticationV2 } = require('../../auth/authUtils');
const roleValidator = require('../../models/validator/role');
const router = express.Router();
router.use(authenticationV2)
router.post('',roleValidator.validateCreate(),asyncHandler(roleController.createRole))
module.exports = router;
