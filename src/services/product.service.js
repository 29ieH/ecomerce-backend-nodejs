const { BadRequestError } = require("../core/error.response")
const { product,clothing,electronic } = require("../models/product.model")
const {onGetSelect,unlSelect,removeUndefiedObject,updateNestedObjectParser} = require("../utils/index")
const ProductRepository = require('../models/repositories/product.repository');
const { startSession } = require("mongoose");
class ProductFactory{
    static regis = {};
    static registedClass = (type,classRef) => {
            ProductFactory.regis[type] = classRef;
    }
    // CREATE PRODUCT
    static createProduct = async ({type,payload}) => {
        const regisSelected = ProductFactory.regis[type?.toUpperCase()];
        if(!regisSelected) throw new BadRequestError('Error Type Product!, pls check')
        return new regisSelected(payload).saveProduct()
    }
    // UPDATE PRODUCT
    static updateProduct = async({type,payload,productId}) => {
        const regisSelected = ProductFactory.regis[type?.toUpperCase()];
        if(!regisSelected) throw new BadRequestError('Error Type Product!, pls check')
        return new regisSelected(payload).updateProduct({productId});
    }
    static updateQuanityProduct = async({productId,quantity},session) => {
        console.log("Session Update Quanity:: ",session)
        console.log("Call update Quantity")
        console.log({productId,quantity})
        const filter = {
            _id:productId,
        },body = {
            $inc:{
                product_quantity:quantity
            }
        },options = {
            new:true,
            session
        }
        return await ProductRepository.updateQuanity(filter,body,options);
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
    static getAllProduct = async({limit=50,page=1,sort='updateAt'}) => {
        const sortBy = sort === 'updateAt' ?  {updateAt:-1} : {sort:1} 
        const filter = {isPublished:true}
        const arrayPick = ['product_name','product_thumb','product_price'];
        const select =  onGetSelect({arrayPick})
        return await ProductRepository.getAllProduct({
            filter,
            limit,
            page,
            sort:sortBy,
            select
        });
    }
    static getProduct = async ({product_id}) => {
        const filter = {
            _id:product_id,
            isPublished:true
        }
        const arrayPick = ['__v'];
        const select = unlSelect({arrayPick})
        return await ProductRepository.getProduct({filter,select})
    }
    static getProductOptionsField = async ({product_id,fields}) => {
        const filter = {
            _id:product_id,
            isPublished:true
        }
        const select = onGetSelect({arrayPick:fields})
        return await ProductRepository.getProduct({filter,select})
    }
    static getProductSelect = async ({
        product_id
    }) => {
        const filter = {
            _id:product_id,
            isPublished:true
        }
        const arrayPick = ['product_name','product_price','product_shop']
        const select = onGetSelect({arrayPick})
    }
    static checkProductByServer = async (products) => {
       return await Promise.all(products.map(async p => {
            const productFound = await this.getProduct({product_id:p.productId});
            if(productFound){
                return {
                    price:productFound.product_price,
                    quantity:p.quantity,
                    productId:p.productId
                }
            }else{
                throw new BadRequestError({message:'Order wrong !!!'})
            }
        }))
    }
}

class Product{
    constructor({
        product_name,product_thumb,product_description,product_price,
        product_type,product_shop,product_attributes
    }){
        this.product_name = product_name,
        this.product_thumb = product_thumb,
        this.product_description = product_description,
        this.product_price = product_price,
        this.product_type = product_type,
        this.product_shop = product_shop,
        this.product_attributes = product_attributes
    }
    async saveProduct(_id){
        return await product.create({...this,_id})
    }
    async updateProduct({productId,bodyUpdate}){
        return await ProductRepository.updateProduct({
            model:product,
            productId,
            bodyUpdate
        })
    }
}

class Clothing extends Product{
    saveProduct = async () => {
        const session = await startSession();
        try{
            session.startTransaction();
            const newClothing = await clothing.create({...this.product_attributes,product_shop:this.product_shop});
            if(!newClothing) throw new  BadRequestError('Wrong something, pls re-create!1')
            const product = await super.saveProduct(newClothing._id);
            if(!product) throw new BadRequestError('Wrong something, pls re-create! 2')
            await session.commitTransaction();
            return {
                code:201,
                data:{
                    product
                }
            }
        }catch(e){
            if(session) await session.abortTransaction();
        }finally{
            session.endSession();
        }
    } 
    updateProduct = async ({productId}) => {
        console.log("Body Update[1]:: ",this)
        const objectParams = removeUndefiedObject(this);
        console.log("Body Update[2]:: ",objectParams)
        console.log("Body This[2]::",updateNestedObjectParser(objectParams))
        if(!objectParams) throw new BadRequestError('Update require body!')
        // Update child 
        if(objectParams.product_attributes){
            const child = await ProductRepository.updateProduct({
                model:clothing,
                productId,
                bodyUpdate:updateNestedObjectParser(objectParams.product_attributes)
            });
        }
        // Update Father
        const product = await super.updateProduct({
            productId,
            bodyUpdate:updateNestedObjectParser(this)
        })
        return product;
    }
}
class Electronic extends Product{
    saveProduct = async () => {
        const session = await startSession();
        try{
            session.startTransaction();
        const newElectronic= await electronic.create({...this.product_attributes,product_shop:this.product_shop});
        if(!newElectronic) throw BadRequestError('Wrong something, pls re-create! 1')
        const product = await super.saveProduct(newElectronic._id);
        if(!product) throw new BadRequestError('Wrong something, pls re-create! 2')
        await session.commitTransaction();
        return {
            code:201,
            data:{
                product
            }
        } 
        }catch(e){
            if(session) await session.abortTransaction();
        }finally{
            session.endSession();
        }
    } 
    updateProduct = async ({productId}) => {
        const objectParams = this;
        if(!objectParams) throw new BadRequestError('Update require body!')
        // Update child 
        if(objectParams.product_attributes){
            const child = await ProductRepository.updateProduct({
                model:clothing,
                productId,
                bodyUpdate:objectParams.product_attributes
            });
        }
        // Update Father
        const product = await super.updateProduct({
            productId,
            bodyUpdate:this
        })
        return product;
    }
}
ProductFactory.registedClass('CLOTHING',Clothing);
ProductFactory.registedClass('ELECTRONICS',Electronic)
module.exports = ProductFactory;