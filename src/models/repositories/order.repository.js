const orderModel = require("../order.model")

class OrderRepository {
    static createOrder = async (body) => {
        return await orderModel.create(body);
    }
}
module.exports = OrderRepository