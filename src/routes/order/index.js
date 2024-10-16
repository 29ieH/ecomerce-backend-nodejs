const express = require('express');
const { authenticationV2 } = require('../../auth/authUtils');
const { asyncHandler } = require('../../helpers/handleUtils');
const OrderController = require('../../controllers/orderController');
const router = express.Router();
router.use(authenticationV2)
router.post("",asyncHandler(OrderController.createOrder))
module.exports = router;
