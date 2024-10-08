const shopModel = require('../shop.model.js')
class ShopRepository{
    static createShop = async(body) => {
        return await shopModel.create(body);
    }
}
module.exports = ShopRepository