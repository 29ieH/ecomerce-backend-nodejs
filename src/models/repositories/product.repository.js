const { BadRequestError } = require('../../core/error.response');
const {product} = require('../product.model')
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

}
module.exports = ProductRepository