const {authenticationV2} = require('../../auth/authUtils')
const app = require('express');
const { asyncHandler } = require('../../helpers/handleUtils');
const DiscountController = require('../../controllers/discountController');
const { authSomeAccess } = require('../../auth/authPermission');
const enumsDocument = require('../../constant/enums.const');
const Router = app.Router();
// GET PUBLIC
Router.get('',asyncHandler(DiscountController.getAllDiscount))
Router.get('/product',asyncHandler(DiscountController.getProductByDiscount))
Router.get('/:codeId',asyncHandler(DiscountController.getDiscountByCode))
Router.use(authenticationV2)
// POST
Router.use(authSomeAccess({roleRq:[enumsDocument.ROLE[1]]}))
Router.post('/shop',asyncHandler(DiscountController.generateByShop))
Router.post('/apply',asyncHandler(DiscountController.getAmountByCode))
Router.post('/cancel',asyncHandler(DiscountController.cancelDiscountByUser))
// PATCH
Router.patch('/shop/:discountId',asyncHandler(DiscountController.updateBySop))
// DELETE
Router.delete('/shop/:discountId',asyncHandler(DiscountController.deleteDiscountByCode))
module.exports = Router;