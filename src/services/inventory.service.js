const InventoryRepository = require("../models/repositories/inventory.repository");
const { getIventory } = require("../models/repositories/inventory.repository")

class InventoryService {
    static validQuanityByProduct = async ({productId,quanity}) => {
        return await getIventory({
            productId,
            stock:{
                $gte:quanity
            }
        });
    }
    static reduceStock = async({productId,quanity}) => {
        const filter = {
            productId
        },body  = {
            $inc:{
                stock: -quanity
            }
        },
        options = {
            new:true
        }
        return await InventoryRepository.updateInventory(filter,body,options)
    }
    static incrementStockByShop = async({productId,shopId,quanity}) => {
        const filter = {
            productId,
            shopId
        },body = {
            $inc:{
                stock:quanity
            }
        },options = {
            new:true
        }
        return await InventoryRepository.updateInventory(filter,body,options)
    }
    static renewStockByShop = async ({productId,stock,address,shopId}) => {
        // 1. NO INVENTORY -> CREATE NEW
        // 2. EXIST INVENTORY -> UPDATE QUANITY
        const foundInventory = await InventoryRepository.getIventory({
            productId,
            shopId
        })
        if(!foundInventory){
            const filter = {
                productId,
                shopId
            },body = {
                productId,
                stock,
                address,
                shopId
            },options = {
                upsert:true,
                new:true
            }
            return await InventoryRepository.updateInventory(filter,body,options)
        }
        return await this.incrementStockByShop({productId,shopId,quanity:stock})
    }
}
module.exports  = InventoryService