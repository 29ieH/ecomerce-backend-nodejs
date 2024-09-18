const { BadRequestError } = require("../core/error.response")
const { product } = require("../models/product.model")

const { product,clothing,electronic } = require("../models/product.model")
class ProductFactory{
    static regis = {};
    static registedClass = (type,classRef) => {
            ProductFactory.regis[type] = classRef;
    }
    static createProduct = async ({type,payload}) => {
        const regisSelected = ProductFactory.regis[type.toUpperCase()];
        if(!regisSelected) throw new BadRequestError('Error Type Product!, pls check')
        return new regisSelected(payload).saveProduct()
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
    saveProduct = async (_id) => {
        await product.create({...this,_id})
    }
}

class Clothing extends Product{
    saveProduct = async () => {
        const newClothing = await clothing.create(this.product_attributes);
        if(!newClothing) throw BadRequestError('Wrong something, pls re-create!')
        const product =  super.saveProduct(newClothing._id);
        if(!product) throw new BadRequestError('Wrong something, pls re-create!')
        return {
            code:201,
            data:{
                user,
                product
            }
        }
    } 
}
class Electronic extends Product{
    saveProduct = async () => {
        const newElectronic= await electronic.create(this.product_attributes);
        if(!newElectronic) throw BadRequestError('Wrong something, pls re-create!')
        const product =  super.saveProduct(newElectronic._id);
        if(!product) throw new BadRequestError('Wrong something, pls re-create!')
        return {
            code:201,
            data:{
                user,
                product
            }
        }
    } 
}
ProductFactory.registedClass('CLOTHING',Clothing);
ProductFactory.registedClass('ELECTRONIC',Electronic)
module.exports = {
    ProductFactory
}