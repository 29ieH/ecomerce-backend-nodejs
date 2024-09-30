const discountModel = require("../discount.model")

class DiscountRepository{
    static checkExistDiscount = async ({discount_code,discount_shopId}) => {
        return await discountModel.findOne({
            discount_code,
            discount_shopId,
        })
    }
    static createDiscount = async ({
         name,description,type,value,code,startDate,endDate,
            maxUses,maxUsesPerUser,appliesTo,productIds,minOrder,countUses,shopId
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
            discount_min_order_value:minOrder,
            discount_uses_count:countUses,
            discount_shopId:shopId,
            discount_start_date:startDate,
            discount_end_date:endDate
        })
    }
    static updateDiscountByShop = async ({
        filter,body
    }) => {

        return await discountModel.findOneAndUpdate(
            filter,
            body
            ,{new:true}
        )
    }
    static getAllDiscount = async({filter,limit,page,sort}) => {
        const skip = (page-1)*limit;
        return await discountModel.find(filter)
        .limit(limit)
        .skip(skip)
        .sort(sort);
    }
    static getDiscountByCode = async({filter}) => {
        return await discountModel.findOne(
            filter
        )
    }
    static deleteDiscountByCode = async({filter}) => {
        return await discountModel.deleteOne(
            filter
        )
    }
    static checkDiscountExist =  async ({filter}) => {
        return await discountModel.findOne(filter).lean();
    }
 }
module.exports = DiscountRepository