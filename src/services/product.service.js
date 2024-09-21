const { BadRequestError } = require("../core/error.response")
const { product,clothing,electronic } = require("../models/product.model")
const {onGetSelect} = require("../utils/index")
const ProductRepository = require('../models/repositories/product.repository')
class ProductFactory{
    static regis = {};
    static registedClass = (type,classRef) => {
            ProductFactory.regis[type] = classRef;
    }
    static createProduct = async ({type,payload}) => {
        const regisSelected = ProductFactory.regis[type?.toUpperCase()];
        if(!regisSelected) throw new BadRequestError('Error Type Product!, pls check')
        return new regisSelected(payload).saveProduct()
    }
    static getAllProductDrafts = async({product_shop,limit=50,skip=0}) => {
        const query = {product_shop,isDrafts:true};
        return await ProductRepository.getAllProductDraftsByShop({query,limit,skip});
    }
    static getAllProductPublished = async({product_shop,limit=50,skip=0}) => {
        const query = {product_shop,isPublished:true};
        return await ProductRepository.getAllProductPublishedByShop({query,limit,skip});
    }
    static searchProductByText = async({keyword,limit=50,page=1}) => {
        const arrayPick = ['product_name','product_thumb','product_price'];
        const select =  onGetSelect({arrayPick})
        return await ProductRepository.searchProductByText({keyword,limit,page,select})
    }
    static publishedProduct = async({product_shop,id}) => {
        const query = {_id:id,product_shop,isDrafts:true};
        return await ProductRepository.publishedProduct({query})
    }
}

class Product{
    constructor({
        product_name,product_thumb,product_description,product_price,
        product_quantity,product_type,product_shop,product_attributes
    }){
        this.product_name = product_name,
        this.product_thumb = product_thumb,
        this.product_description = product_description,
        this.product_price = product_price,
        this.product_quantity = product_quantity,
        this.product_type = product_type,
        this.product_shop = product_shop,
        this.product_attributes = product_attributes
    }
    async saveProduct(_id){
        return await product.create({...this,_id})
    }
}

class Clothing extends Product{
    saveProduct = async () => {
        const newClothing = await clothing.create({...this.product_attributes,product_shop:this.product_shop});
        if(!newClothing) throw new  BadRequestError('Wrong something, pls re-create!1')
        const product = await super.saveProduct(newClothing._id);
        if(!product) throw new BadRequestError('Wrong something, pls re-create! 2')
        return {
            code:201,
            data:{
                product
            }
        }
    } 
}
class Electronic extends Product{
    saveProduct = async () => {
        const newElectronic= await electronic.create({...this.product_attributes,product_shop:this.product_shop});
        if(!newElectronic) throw BadRequestError('Wrong something, pls re-create! 1')
        const product = await super.saveProduct(newElectronic._id);
        if(!product) throw new BadRequestError('Wrong something, pls re-create! 2')
        return {
            code:201,
            data:{
                product
            }
        }
    } 
}
ProductFactory.registedClass('CLOTHING',Clothing);
ProductFactory.registedClass('ELECTRONICS',Electronic)
module.exports = ProductFactory;