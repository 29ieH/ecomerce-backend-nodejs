'use strict'
const express = require('express');
const ProductController = require('../../controllers/productController')
const { authenticationV2 } = require('../../auth/authUtils');
const { asyncHandler } = require('../../helpers/handleUtils');
const Router = express.Router();
// Gets not authen
Router.get("/product/search",asyncHandler(ProductController.searchProductByText))
Router.get("/product",asyncHandler(ProductController.getAllProduct))
Router.get("/product/:product_id",asyncHandler(ProductController.getProduct))
// Authentication
Router.use(authenticationV2)
// Post
Router.post("/product",asyncHandler(ProductController.createProduct))
// PUT
Router.put("/product/published/:id",asyncHandler(ProductController.publishedProduct))
// PATCH
Router.patch("/product/:productId",asyncHandler(ProductController.updateProduct))
// Gets
Router.get("/product/drafts",asyncHandler(ProductController.getAllDrafts))
Router.get("/product/published",asyncHandler(ProductController.getAllPublished))
module.exports = Router
