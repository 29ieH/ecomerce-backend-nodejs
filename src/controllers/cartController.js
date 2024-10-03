const { OK } = require('../core/success.response');
const CartService = require('../services/cart.service');
class CartController{
    static createProductToCart  = async (req,res,next) => {   
        new OK({
            metaData: await CartService.addProductCart({
               ...req.body
            })
        }).send(res)
    }
    static getListToCart  = async (req,res,next) => {   
        new OK({
            metaData: await CartService.getListToCart({
               ...req.params,...req.body
            })
        }).send(res)
    }
    static updateCart = async (req,res,next) => {
        new OK({
            metaData:await CartService.updateCart(
               req.body
            )
        }).send(res)
    }
    static deleteCartItem  = async (req,res,next) => {   
        new OK({
            metaData: await CartService.deleteCartItem({
               ...req.query
            })
        }).send(res)
    }
}
module.exports = CartController;