const inventoryModel = require("../inventory.model")

class InventoryRepository {
    static getIventory = async (filter) => {
        return await inventoryModel.findOne(filter).lean();
    }
    static updateInventory = async (filter={},body={},options={}) => {
        return await inventoryModel.findOneAndUpdate(filter,body,options)
    }
}
module.exports = InventoryRepository