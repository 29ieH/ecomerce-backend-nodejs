const CartRepository = require("../models/repositories/cart.repository")

class CartService{
    // Add product to cart
    /*
    Check cart is exist -> if not exist -> create cart and push product
    If product is exist in cart, increase quantity this.
    */
    static createCartUser = async (userId,product) => {
        const query = {
            cartUserId:userId,
            cartState:'active'
        }
        const insertOrUpdate = {
            $addToset:{
                cartProducts:product
            },
            $inc:{
                cartCountProduct:+product.quanity
            }
        }
        const options = {
            upsert:true,
            new:true
        }
        return await CartRepository.createCartUser({
            filter:query,
            body:insertOrUpdate,
            options
        })
    }
    static updateCartQuanity = async (userId,product) => {
        const query = {
            cartUserId:userId,
            'cartProducts.productId':product.productId,
            cartState:'active'
        }
        const updateSet = {
            $inc:{
                'cartProducts.$.quanity':+product.quanity
            }
        }
        const options = {
            upsert:true,
            new:true
        }
        return await CartRepository.createCartUser({
            filter:query,
            body:updateSet,
            options
        })
    }

    static addProductCart = async ({userId,product}) => {
        const filter = {
            cartUserId:userId,
            cartState:'active'
        }
        // 1. Check exist cart
        const cartUser = await CartRepository.checkExistCart({
            filter
        })
        //Case 1: Cart not exist
        if(!cartUser){
            // Create cart and push product
            return createCartUser(userId,product)
        }
//      Case 2: Cart is exist, but empty product
        if(!cartUser.cartProducts.length>0){
            cartUser.cartProducts = [product];
            cartUser.cartCountProduct = product.quanity
            return await cartUser.save();
        }
//      Case 3: Cart is exist, but like product -> update quanity 
        return await CartService.updateCartQuanity(userId,product)

    }
}
module.exports = CartService