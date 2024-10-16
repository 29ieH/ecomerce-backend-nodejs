'use strict'
const express = require('express');
const InventoryController = require('../../controllers/inventoryController');
const {asyncHandler} = require('../../helpers/handleUtils');
const { authenticationV2 } = require('../../auth/authUtils');
const { authenRole, authSomeAccess } = require('../../auth/authPermission');
const enumsDocument = require('../../constant/enums.const');
const router = express.Router();
router.use(authenticationV2)
router.use(asyncHandler(authSomeAccess({roleRq:[enumsDocument.ROLE[1]]})))
router.post('/renew',asyncHandler(InventoryController.renewStockByShop))
module.exports = router;
