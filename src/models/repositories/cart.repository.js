const cartModel = require("../cart.model")

class CartRepository{
    static checkExistCart = async ({filter}) => {
        return await cartModel.findOne(filter)
    }
    // Create after User add product - if user is new customer
    static createCartUser = async ({filter,body,options}) => {
        return await cartModel.findOneAndUpdate(filter,body,options);
    }
}
module.exports = CartRepository