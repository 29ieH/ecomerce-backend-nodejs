'use strict'
const express = require('express');
const { authenticationV2 } = require('../../auth/authUtils');
const { asyncHandler } = require('../../helpers/handleUtils');
const CartController = require('../../controllers/cartController');
const Router = express.Router();
// Gets not authen
// Authentication
Router.use(authenticationV2)
// GET
Router.get("/product",asyncHandler(CartController.getListToCart))
// Post
Router.post("/product",asyncHandler(CartController.createProductToCart))
// PATCH
Router.patch("/product",asyncHandler(CartController.updateCart))
// DELETE
Router.delete("/product",asyncHandler(CartController.deleteCartItem))
module.exports = Router
