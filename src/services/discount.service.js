const { BadRequestError } = require("../core/error.response")
const DiscountRepository = require("../models/repositories/discount.repository")
const ProductRepository = require("../models/repositories/product.repository")

class DiscountService{
     static genDiscountByShop = async (
        {
            name,description,type,value,code,startDate,endDate,
            maxUses,maxUsesPerUser,appliesTo,productIds,shopId
        }
     ) =>  {
        // Check date
        if(new Date() < new Date(startDate) || new Date() > new Date(endDate) ) 
            throw new BadRequestError('Discount date is expired')
        if(startDate <= endDate ) throw new BadRequestError('Start date must be than end date')
        // Check exist discount
        const discountFound = await DiscountRepository.checkExistDiscount({
            discount_code:code,
            discount_shopId:shopId
        })
        if(!discountFound) throw new BadRequestError('Distcount is exist');
        // Check valid product.
        const productIdsValid = appliesTo === 'all' ? [] : productIds;
        if(!ProductRepository.checkExistingProductByShop(productIdsValid)) {
            const productNotFounds = ProductRepository.checkProductNotExistByShop(productIdsValid)
            if(productNotFounds) throw new BadRequestError('Product not found',400,{
                error:true,
                productNotFounds
            })
        }  
        return await DiscountRepository.createDiscount({
            name,description,type,value,code,startDate,endDate,
            maxUses,maxUsesPerUser,appliesTo,productIds:productIdsValid,shopId
        }) 
    }
}
module.exports = DiscountService
