const { startSession } = require("mongoose")
const { BadRequestError } = require("../core/error.response")
const OrderRepository = require("../models/repositories/order.repository")
const { reduckStockByOrder } = require("./inventory.service")
const { handleErros } = require("../utils")

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
        const session = await startSession();
        try {
            session.startTransaction();
            const order =  await OrderRepository.createOrder({
                userId,
                orderItems,
                totalOrder,
                paymentMethods,
                address,
                note
            },session)
            if(order) await reduckStockByOrder(orderItems,session);
            await session.commitTransaction();
            return order;
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestError({message:error.message || 'Order is Error, pls try again'})
        } finally{
            await session.endSession();
        }
    }
}
module.exports = OrderService