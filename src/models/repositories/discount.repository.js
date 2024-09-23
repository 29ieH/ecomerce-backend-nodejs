const discountModel = require("../discount.model")

class DiscountRepository{
    static checkExistDiscount = async ({discount_code,discount_shopId}) => {
        return await discountModel.findOne({
            discount_code,
            discount_shopId
        })
    }
    static createDiscount = async ({
         name,description,type,value,code,startDate,endDate,
            maxUses,maxUsesPerUser,appliesTo,productIds,shopId
    }) => {
        return await discountModel.create({
            discount_code: code,
            discount_name:name,
            discount_type:type,
            discount_value:value,
            discount_description:description,
            discount_max_uses:maxUses,
            discount_max_user_uses:maxUsesPerUser,
            discount_applies_to:appliesTo,
            discount_product_ids:productIds,
            discount_shopId:shopId,
            discount_start_date:startDate,
            discount_end_date:endDate
        })
    }
}
module.exports = DiscountRepository