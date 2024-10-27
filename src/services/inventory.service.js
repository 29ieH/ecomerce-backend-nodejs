const { startSession } = require("mongoose");
const { BadRequestError } = require("../core/error.response");
const InventoryRepository = require("../models/repositories/inventory.repository");
const { getIventory } = require("../models/repositories/inventory.repository");
const ProductFactory = require("./product.service");
const ProductRepository = require("../models/repositories/product.repository");

class InventoryService {
    static validQuanityByProduct = async ({productId,quantity}) => {
        return await getIventory({
            productId,
            stock:{
                $gte:quantity
            }
        });
    }
    static reduceStock = async({productId,quantity},session) => {
        const filter = {
            productId
        },body  = {
            $inc:{
                stock: -quantity
            }
        },
        options = {
            new:true,
            session
        }
        try{
            const validQuantityInventory = await InventoryRepository.validQuantity(quantity,productId);
            if(!validQuantityInventory) throw new BadRequestError({message:'Quantity is not valid'})
            const reduceStock =  await InventoryRepository.updateInventory(filter,body,options);
            if(!reduceStock) throw new BadRequestError({message:'Reduce stock error, pls trying again'})
            const updateQuantity = await ProductFactory.updateQuanityProduct({productId,quantity:-quantity},session)
            return reduceStock;
        }catch(e){
            throw e;
        }
    }
    /*
      price:productFound.product_price,
                    quantity:p.quantity,
                    productId:p.productId
    */
    static reduckStockByOrder = async (orderItems = [],session) => {
            try {
               const result =  await Promise.all(orderItems.map(async items => {
                    return await Promise.all(items.item_products.map(async p => {
                        return  await this.reduceStock({productId:p.productId,quantity:p.quantity},session)
                    }))
                }))
            } catch (error) {
                throw error
            }
    }
    static incrementStockByShop = async({productId,shopId,quantity},session) => {
        console.log("Session Increment:: ",session)
        try{
            const filter = {
                productId,
                shopId
            },body = {
                $inc:{
                    stock:quantity
                }
            },options = {
                new:true,
                session
            }
    
                const increment =  await InventoryRepository.updateInventory(filter,body,options)
                console.log("Increment:: ",increment)
                const updateQuanity = await ProductFactory.updateQuanityProduct({productId,quantity},session)
                console.log("update Quantity:: ",updateQuanity)
                return increment;
        }catch(e){
            console.log("Error Increment:: ",e)
        }
    }
    static createInventoryByProduct = async ({productId,stock,address, shopId},session) => {
        try{
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
                new:true,
                session
            }
            const inventoryProduct =  await InventoryRepository.updateInventory(filter,body,options)
            console.log("Inventories Product:: ",inventoryProduct)
            const updateQuanity = await ProductFactory.updateQuanityProduct({productId,quantity:stock},session)
            console.log("Update quantity:: ",updateQuanity)
            return inventoryProduct;
        }catch(e){
            console.log("Error create:: ",e)
        }
    }
    static renewStockByShop = async ({productId,stock,address,shopId}) => {
        // 1. Check product renew of shop ?    
        // 1. NO INVENTORY -> CREATE NEW
        // 2. EXIST INVENTORY -> UPDATE QUANITY
        const validResotckProduct = await ProductRepository.checkExistProduct({
            _id:productId,
            product_shop:shopId
        })
        if(!validResotckProduct) throw new BadRequestError({message:'Product is not valid'});
        const foundInventory = await InventoryRepository.getIventory({
            productId,
            shopId
        })
        const session = await startSession();
        try{
            session.startTransaction();
            let result;
            if(!foundInventory){
                result =  await this.createInventoryByProduct({productId,stock,address,shopId},session);
             }
            if(!result) result = await this.incrementStockByShop({productId,shopId,quantity:stock},session)
            await session.commitTransaction();
            return result;
        }catch(e){
            console.log("Error:: ",e)
            await session.abortTransaction();
            throw new BadRequestError({message:'Error something, pls trying again'})
        }finally{
            console.log("End sesssion")
            session.endSession();
        }
    }
}
module.exports  = InventoryService