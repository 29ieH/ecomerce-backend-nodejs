const { BadRequestError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const DiscountRepository = require("../models/repositories/discount.repository")
const ProductRepository = require("../models/repositories/product.repository")
const { convertToObjectIdMongo, updateNestedObjectParser, removeUndefiedObject, onGetSelect } = require("../utils")

class DiscountService{
     static generateDiscountByShop = async (
        {
            name,description,type,value,code,startDate,endDate,
            maxUses,maxUsesPerUser,appliesTo,productIds,minOrder,shopId
        }
     ) =>  {
        console.log('Generate Discount Service - Shop!!')
        // Check date
        if(new Date() < new Date(startDate) || new Date() > new Date(endDate) ) 
            throw new BadRequestError('Discount date is expired')
        if(startDate >= endDate ) throw new BadRequestError('Start date must be than end date')
        // Check exist discount
        const discountFound = await DiscountRepository.checkExistDiscount({
            discount_code:code,
            discount_shopId:shopId
        })
        
        if(discountFound) throw new BadRequestError('Distcount is exist');
        
        // Check valid product.
        const productIdsValid = appliesTo === 'all' ? [] : productIds;
        if(appliesTo!=='all'){
            console.log("Rest condition")
            if(!( await ProductRepository.checkExistingProductByShop({shopId,productIds:productIdsValid}))) {
                console.log("Nested condition")
                const productNotFounds =  await ProductRepository.checkProductNotExistByShop({shopId,productIds:productIdsValid})
                if(productNotFounds) throw new BadRequestError('Product not found',400,{
                   data:productNotFounds
                })
            }  
        }
        const countUses = 0;
        return await DiscountRepository.createDiscount({
            name,description,type,value,code,startDate,endDate,
            maxUses,maxUsesPerUser,appliesTo,productIds:productIdsValid,
            minOrder,countUses,shopId
        }) 
    }
    static updateDiscountByShop = async ({shopId,discountId,body}) => {
        const filter = {
            discount_shopId: convertToObjectIdMongo(shopId),
            _id:convertToObjectIdMongo(discountId),
            discount_is_active:true
        }
        const {
            code:discount_code,
            name:discount_name,
            type:discount_type,
            value:discount_value,
            description:discount_description,
            maxUses:discount_max_uses,
            maxUsesPerUser:discount_max_user_uses,
            appliesTo:discount_applies_to,
            productIds:discount_product_ids,
            minOrder:discount_min_order_value,
            countUses:discount_uses_count,
            startDate:discount_start_date,
            endDate:discount_end_date
        } = body
        let bodyParser = {
            discount_code,
            discount_name,
            discount_type,
            discount_value,
            discount_description,
            discount_max_uses,
            discount_max_user_uses,
            discount_applies_to,
            discount_product_ids,
            discount_min_order_value,
            discount_uses_count,
            discount_start_date,
            discount_end_date
        }
        bodyParser = updateNestedObjectParser(removeUndefiedObject(bodyParser));
        return await DiscountRepository.updateDiscountByShop({
            filter,body:bodyParser
        })
    }
    static getAllDiscount  = async ({limit=50,page=1,sort='etc'}) => {
        const sortBy = sort === 'etc' ? {_id:-1} : {_id:1};
        const filter = {
            discount_is_active:true
        }
        return await DiscountRepository.getAllDiscount({
            filter,
            limit,
            page,
            sort:sortBy
        });
    }
    static getDiscountByCode = async ({codeId}) => {
        const filter = {
            discount_code:codeId,
            discount_is_active:true
        }
        return await DiscountRepository.getDiscountByCode({filter})
    }
    static deleteDiscountByCode = async ({shopId,discountId}) => {
        const filter = {
            discount_code: discountId,
            discount_shopId:shopId,
            discount_is_active:true
        };
        return await DiscountRepository.deleteDiscountByCode({filter})
    }
    static getDiscountAmount = async({
        code,userId,shopId,products        
    }) => {
        const filter = {
            discount_code:code,
            discount_shopId:convertToObjectIdMongo(shopId)
        }
        const discountFound = await DiscountRepository.checkDiscountExist({filter});
        if(!discountFound) throw new BadRequestError('Discount is not exist !!!');
        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_max_user_uses,
            discount_user_used,
            discount_type,
            discount_value
        } = discountFound
        if(!discount_is_active) throw new BadRequestError('Discount is expired')
        if(!discount_max_uses) throw new BadRequestError('Discount are out')
        let totalOrder = 0;
        if(discount_min_order_value>0) {
            console.log("Pass min order")
            console.log("Products:: ",products)
            totalOrder = products.reduce((acc,currentValue) =>(
                acc+currentValue.quanity*currentValue.price
            ),0)
            console.log(`Total Order:: ${totalOrder}`)
            if(totalOrder < discount_min_order_value)
                 throw new BadRequestError(`Discount requires a minium order value of ${discount_min_order_value}`)
        }
        if(discount_max_user_uses>0){
            const userUsedDiscount = discount_user_used.filter(user => user.userId === userId).length;
            if(userUsedDiscount>=discount_max_user_uses) 
                 throw new BadRequestError('This discount code has been used by maximum users')
        }
        const amount = discount_type === 'mixed_price' ? discount_value : totalOrder * (discount_value/100);
        console.log("Discount Value:: ",discount_value)
        return {
            totalOrder,
            discount:amount,
            totalPrice: totalOrder - amount
        }
    }
    static cancelDiscountByUser = async ({userId,code,shopId}) => {
        const filter = {
            discount_code:code,
            discount_shopId:shopId
        }
        const discountFound = await DiscountRepository.checkDiscountExist({
            filter
        })
        if(!discountFound) throw new BadRequestError('Discount is not exist')
        const result = await discountModel.findByIdAndUpdate(discountFound._id,{
            $pull:{
                discount_user_used:userId
            },
            $inc:{
                discount_max_uses:1,
                discount_uses_count:-1
            }
        })
        return result;
    }
    static getAllProductByDiscount = async ({code,shopId,limit=50,page=1,sort='etc'}) => {
        const filter = {
            discount_code:code,
            discount_shopId:shopId
        }
        const discountFound = await DiscountRepository.checkDiscountExist({
            filter
        })
        if(!discountFound) throw new BadRequestError('Discount are not exist')
        const {
            discount_applies_to,discount_is_active
        } = discountFound
        if(!discount_is_active) throw new BadRequestError('Discount has expired ')
        let products
    // Get all products by shop - Discount apply all product
        if(discount_applies_to==='all'){
            const filter = {
                product_shop:shopId,
                isPublished:true
            }
            const arrayPick = ['product_name','product_thumb','product_price'];
            const select =  onGetSelect({arrayPick})
            products = await ProductRepository.getAllProduct({
                filter,
                limit:+limit,
                page:+page,
                sort,
                select
            })            
        }
    // Get products apply disscount
        if(discount_applies_to==='specific'){
            const {
                discount_product_ids
            } = discountFound
            const filter = {
                _id:{
                    $in:discount_product_ids
                }
            }
            const arrayPick = ['product_name','product_thumb','product_price'];
            const select =  onGetSelect({arrayPick})
            products =  await ProductRepository.getAllProduct({
                filter,
                limit:+limit,
                page:+page,
                sort,
                select
            })         
        }
        return {
            code,
            products
        }
    }
}
module.exports = DiscountService
