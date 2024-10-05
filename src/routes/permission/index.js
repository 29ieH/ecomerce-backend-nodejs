'use strict'
const express = require('express');
const permissionController = require('../../controllers/permissionController');
const {asyncHandler} = require('../../helpers/handleUtils');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();
router.use(authenticationV2)
router.post('',asyncHandler(permissionController.createPermission))
module.exports = router;
