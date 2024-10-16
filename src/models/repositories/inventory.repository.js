const inventoryModel = require("../inventory.model")

class InventoryRepository {
    static getIventory = async (filter) => {
        return await inventoryModel.findOne(filter).lean();
    }
    static validQuantity = async (quantity,productId) => {
        return await inventoryModel.findOne({
            productId,
            stock:{$gte:quantity}
        }).lean();
    }
    static updateInventory = async (filter={},body={},options={}) => {
        return await inventoryModel.findOneAndUpdate(filter,body,options)
    }
}
module.exports = InventoryRepository