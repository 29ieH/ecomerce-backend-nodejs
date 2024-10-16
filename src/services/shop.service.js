const shopModel = require("../models/shop.model")
class ShopService{
    static existEmail = async ({email,select = {
        name:1,
        email:1,
        status:1
    }}) => {
        return await shopModel.findOne({email}).select(select).lean();
    }
    static checkExisShop= async ({filter}) => {
        return await shopModel.findOne(filter).lean();
    }
}
module.exports = ShopService;