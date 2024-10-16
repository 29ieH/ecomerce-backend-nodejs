const {OK} = require('../core/success.response')
const OrderService = require('../services/order.service')
class OrderController{
    static createOrder = async (req,res,next) => { 
        const {userId} = req.user;
        new OK(
            {
                metaData:await OrderService.createOrder({userId,...req.body})
            }
        ).send(res)
    }
}
module.exports = OrderController