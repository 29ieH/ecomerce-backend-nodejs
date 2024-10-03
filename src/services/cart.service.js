const { BadRequestError } = require("../core/error.response")
const CartRepository = require("../models/repositories/cart.repository")
const ProductRepository = require("../models/repositories/product.repository")
const { unlSelect, convertToObjectIdMongo } = require("../utils")
const ProductFactory = require("./product.service")

class CartService{
    // Add product to cart
    /*
    Check cart is exist -> if not exist -> create cart and push product
    If product is exist in cart, increase quantity this.
    */
    static createCartUser = async (userId,product) => {
        console.log("Product case1:: ",product)
        const query = {
            cartUserId:userId,
            cartState:'active'
        }
        const insertOrUpdate = {
            $addToSet:{
                cartProducts:product
            },
            $inc:{
                cartCountProduct:+product.quantity
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
    static updateCartquantity = async (userId,product) => {
        console.log("UPDATE quantity::",product)
        const query = {
            cartUserId:userId,
            'cartProducts._id':product._id,
            cartState:'active'
        }
        const updateSet = {
            $inc:{
                'cartProducts.$.quantity':product.quantity,
                cartCountProduct:product.quantity
            }
        }
        const options = {
                new:true
        }
        return await CartRepository.createCartUser({
            filter:query,
            body:updateSet,
            options
        })
    }
    static addProduct = async (userId,product) => {
        const filter = {
            cartUserId:userId,
            cartState:'active'
        },body = {
            $addToSet:{
                cartProducts:product
            },
            $inc:{
                cartCountProduct:product.quantity
            }
        },options={
            upsert:true,
            new:true
        }
        return await CartRepository.createCartUser({
            filter,body,options
        })
    }

    static checkProductIsExist = (cart,product) => {
        return cart.cartProducts?.find(p => String(p._id) === String(product._id))
    }

    static addProductCart = async ({userId,product}) => {
        // Get info product  
        let productFound = await ProductFactory.getProductOptionsField({
            product_id : product.productId,
            fields: ['_id','product_name','product_price','product_shop']
        })
        if(!productFound) throw new BadRequestError('Product is not exist')
        const {quantity} = product;
        productFound = {...productFound,quantity};
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
            return this.createCartUser(userId,productFound)
        }
//      Case 2: Cart is exist, but empty product
        if(cartUser.cartProducts.length===0){
            cartUser.cartProducts = [productFound];
            cartUser.cartCountProduct = productFound.quantity
            return await cartUser.save();
        }
        const existProductInCart = CartService.checkProductIsExist(cartUser,productFound);
//      Case 3: Cart is exist, but like product -> update quantity 
        if(existProductInCart){
            return await CartService.updateCartquantity(userId,productFound)
        }else{
        //      Case 4: Cart is exist, product is not contain
            return await CartService.addProduct(userId,productFound)
        }
    }
    static getListToCart = async ({userId,limit,page,sort = 'etc'}) => {
        const filter = {
            cartUserId:userId,
            cartState:'active'
        }
        const sortBy = sort === 'etc' ? {updatedAt:-1} : {_id:1}
        const arrayPick = ['__v',]
        const select = unlSelect({arrayPick})
        return await CartRepository.getListToCart({
            filter
            ,limit
            ,page
            ,select,
            sort:sortBy
        })
    }
    static deleteCartItem = async ({userId,productId}) => {
        const filter = {
            cartUserId:userId,
            cartState:'active'
        }
        const foundCart = await CartRepository.checkExistCart({filter});
        console.log("FoundCart:: ",foundCart)
        if(!foundCart) throw new BadRequestError('Something happen Error, pls re-start')
        const productIncart = foundCart?.cartProducts?.find(p => String(p._id) === String(productId));
        if(!productIncart)  throw new BadRequestError('Something happen Error, pls re-start')
        console.log("Product in cart:: ",productIncart)
        // const query = {
        //     cartUserId:foundCart.cartUserId,
        //     cartState:'active'
        // },
        // body = {
        //     $pull:{
        //         cartProducts:{
        //             _id:convertToObjectIdMongo(productId)
        //         }
        //     },
        //     $inc:{
        //      cartCountProduct:-productIncart.quantity    
        //     }
        // },
        // options = {
        //     new:true
        // }
        // return await CartRepository.deleteCartItem({
        //     filter:query,
        //     body,
        //     options
        // })
        foundCart.cartProducts = foundCart?.cartProducts.filter(p => p != productIncart)
        foundCart.cartCountProduct = foundCart?.cartCountProduct - productIncart.quantity;
        return await foundCart.save();
    }
    /*
    Update cart
            order_shop_ids:[
                {
                    shopId:'abc',
                    items_order:[
                        {
                            'productId':'12ac',
                            'quantity':2,
                            'price'
                            'quantityOld':1,
                            'shopId':'abc'
                        },
                            {
                            'productId':'12ac',
                            'quantity':2,
                            'price'
                            'quantityOld':1,
                            'shopId':'abc'
                        }
                    ]
                },{


                }
            ]
    */
   static updateCart = async ({userId,shopOrderIds}) => {
        const {productId,quantity,quantityOld} = shopOrderIds[0]?.itemsOrder[0];
        const foundProduct = await ProductRepository.getProduct({
            _id:productId,isPublished:true
        })
        if(!foundProduct) throw new BadRequestError('Not found product')
        if(foundProduct.product_shop.toString()!==shopOrderIds[0]?.shopId)
            throw new BadRequestError('Product do not belong to the shop')
        if(quantity==0){
            return await this.deleteCartItem({
                userId,
                productId
            })
        }
        const product = {
            _id:convertToObjectIdMongo(productId),
            quantity:quantity-quantityOld
        }
        const result  =  await this.updateCartquantity(
            userId,product
        )
        console.log("Result:: ",result)
        return result;
   }
}
module.exports = CartService