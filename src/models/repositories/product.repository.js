const { filter } = require('lodash');
const { BadRequestError } = require('../../core/error.response');
const {product} = require('../product.model');
const { convertToObjectIdMongo } = require('../../utils');
class ProductRepository{
    static getAllProductDraftsByShop = async ({query,limit,skip}) => {
        return await ProductRepository.getProductQuery({query,limit,skip});
    }
    static getAllProductPublishedByShop = async ({query,limit,skip}) => {
        return await ProductRepository.getProductQuery({query,limit,skip});
    }
    static publishedProduct = async({query}) => {
        const productFound = await product.findOne(query);
        if(!productFound) throw new BadRequestError('Product not found');
        productFound.isDrafts = false;
        productFound.isPublished = true;
        const result = await productFound.save();
        return result;
    }
    static searchProductByText = async({keyword,limit,page,select=[]}) => {
        const regex = new RegExp(keyword);
        let skip = (page-1)*limit;
        return await product.find({    
            isPublished:true,
            $text:{
                $search:regex
            }},
            {
                score:{
                    $meta: 'textScore'
                }
            }
        ).limit(limit)
        .skip(skip)
        .select(select)
        .lean();
    }
    static getProductQuery = async ({query,limit,skip}) => {
        return await product.find(query).populate(
            // {
            //     path:'product_shop',
            //     select: 'name email',
            //     options:{_id:0}
            // }
            'product_shop','name email -_id'
        )
        .sort({
            updateAt:-1
        })
        .skip(skip)
        .limit(limit)
        .lean();
    }
    static getAllProduct = async({filter,limit,page,sort,select = []}) => {
        const skip = (page-1)*limit;
        return await 
        product.find(filter)
        .limit(limit)
        .skip(skip)
        .select(select)
        .sort(sort)
        .lean();
    }
    static getProduct = async({filter,limit,page,select = []}) => {
        const skip = (page-1)*limit;
        return await 
        product.findOne(filter)
        .limit(limit)
        .skip(skip)
        .select(select)
        .lean();
    }
    static updateProduct = async({model,productId,bodyUpdate}) => {
        try{
            const result =  await model.findByIdAndUpdate(productId,bodyUpdate,{new:true})
            return result;
        }catch(e){
            console.log("Error Update:: ",e)
        }
    }
    static checkProductNotExistByShop = async ({
        shopId,
        productIds
    }) => {
        let result = [];
        for(const id of productIds){
            const productFound = await product.findOne({
                _id:convertToObjectIdMongo(id),
                product_shop:shopId
            })
            if(!productFound) result.push({productId:id,status:'not found'})
        }
        return result;
    }
    static checkExistingProductByShop = async({
        shopId,
        productIds
    }) => {
        const products = await product.find({
            _id:{$in:productIds},
            product_shop:shopId
        })
        console.log("Products:: ",products.length === productIds.length)
        return products.length === productIds.length
    }
}
module.exports = ProductRepository