const {OK} = require('../core/success.response')
const CheckoutService = require('../services/checkout.service')
class checkoutController{
    static review = async(req,res,next) => {
        new OK({
            message:'Review order product',
            metaData: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }
}
module.exports = checkoutController