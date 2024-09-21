const { OK } = require('../core/success.response');
const ProductService = require('../services/product.service')
class ProductController{
    static createProduct  = async (req,res,next) => {   
        const {userId} = req.user;
        new OK({
            metaData: await ProductService.createProduct({
                type:req.body.product_type,
                payload:{
                    ...req.body,
                    product_shop:userId
                }
            })
        }).send(res)
    }
    static getAllDrafts = async (req,res,next) => {
        const {userId} = req.user;
        new OK({
            metaData: await ProductService.getAllProductDrafts({
                product_shop:userId
            })
        }).send(res)
    }
    static getAllPublished = async (req,res,next) => {
        const {userId} = req.user;
        new OK({
            metaData: await ProductService.getAllProductPublished({
                product_shop:userId
            })
        }).send(res)
    }
    static publishedProduct = async (req,res,next) => {
        const {userId } = req.user;
        const {id} = req.params;
        new OK({
            metaData: await ProductService.publishedProduct({
                product_shop:userId,id
            })
        }).send(res)
    }
    static searchProductByText = async (req,res,next) => {
        const {keyword} = req.query;
        console.log(`Call search text - keyword:: ${keyword}`)
        new OK({
            metaData: await ProductService.searchProductByText({keyword})
        }).send(res)
    }
}
module.exports = ProductController;