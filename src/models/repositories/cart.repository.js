const cartModel = require("../cart.model")

class CartRepository{
    static checkExistCart = async ({filter}) => {
        console.log("Filer:: ",filter)
        return await cartModel.findOne(filter)
    }
    // Create after User add product - if user is new customer
    static createCartUser = async ({filter,body,options}) => {
        return await cartModel.findOneAndUpdate(filter,body,options);
    }
    static getListToCart = async ({
        filter,limit=50,page=1,select,sort
    }) => {
        const skip = (page-1)*limit;
        return await 
        cartModel.findOne(filter)
        .skip(skip)
        .limit(limit)
        .select(select)
        .sort(sort)
    }
    static deleteCartItem = async({filter,body,options}) => {
        return await cartModel.findOneAndUpdate(filter,body,options)
    }
}
module.exports = CartRepository