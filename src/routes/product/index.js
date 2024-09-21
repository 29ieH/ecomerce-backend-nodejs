'use strict'
const express = require('express');
const ProductController = require('../../controllers/productController')
const { authenticationV2 } = require('../../auth/authUtils');
const { asyncHandler } = require('../../helpers/handleUtils');
const Router = express.Router();
// Gets not authen
Router.get("/product/search",asyncHandler(ProductController.searchProductByText))
// Authentication
Router.use(authenticationV2)
// Post
Router.post("/product",asyncHandler(ProductController.createProduct))
// PUT
Router.put("/product/published/:id",asyncHandler(ProductController.publishedProduct))
// Gets
Router.get("/product/drafts",asyncHandler(ProductController.getAllDrafts))
Router.get("/product/published",asyncHandler(ProductController.getAllPublished))
module.exports = Router
