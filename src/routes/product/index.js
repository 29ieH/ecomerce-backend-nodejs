'use strict'
const express = require('express');
const ProductController = require('../../controllers/productController')
const { authenticationV2 } = require('../../auth/authUtils');
const { asyncHandler } = require('../../helpers/handleUtils');
const Router = express.Router();
// Gets not authen
Router.get("/search",asyncHandler(ProductController.searchProductByText))
Router.get("",asyncHandler(ProductController.getAllProduct))
Router.get("/:product_id",asyncHandler(ProductController.getProduct))
// Authentication
Router.use(authenticationV2)
// Post
Router.post("",asyncHandler(ProductController.createProduct))
// PUT
Router.put("/published/:id",asyncHandler(ProductController.publishedProduct))
// PATCH
Router.patch("/:productId",asyncHandler(ProductController.updateProduct))
// Gets
Router.get("/drafts",asyncHandler(ProductController.getAllDrafts))
Router.get("/published",asyncHandler(ProductController.getAllPublished))
module.exports = Router
