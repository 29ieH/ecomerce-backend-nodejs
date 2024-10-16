const orderModel = require("../order.model")

class OrderRepository {
    static createOrder = async (body,session=null) => {
        const bodyCreate = (session) ? [body] : body;
        return await orderModel.create(bodyCreate,{session});
    }
}
module.exports = OrderRepository