const { BadRequestError } = require("../core/error.response")
const OrderRepository = require("../models/repositories/order.repository")

class OrderService {    
    /*
     1. Create order
     2. Check order - if exist -> update quanity Invetory ( Ivnetory -> update quanity product)
    */
    static createOrder = async ({
        userId,
        orderItems = [],
        totalOrder = {},
        paymentMethods,
        address,
        note
    }) => {
        const order =  await OrderRepository.createOrder({
            userId,
            orderItems,
            totalOrder,
            paymentMethods,
            address,
            note
        })
        if(!order) throw new BadRequestError('Order is Error, pls try again')
        /* 
            Update quanity Inventory ... 
        */
    }
}
module.exports = OrderService