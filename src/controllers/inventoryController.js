const {OK} = require('../core/success.response')
const InventoryService = require('../services/inventory.service')
class InventoryController{
    static renewStockByShop = async(req,res,next) => {
        const {shopId} = req.shop;
        console.log(shopId)
        new OK({
            message:'Review order product',
            metaData: await InventoryService.renewStockByShop({shopId,...req.body})
        }).send(res)
    }
}
module.exports = InventoryController