const {Schema,model} = require('mongoose'); // Erase if already required

const productSchema = new Schema({
    product_name : {type:String,required:true},
    product_thumb: {type:String,required:true},
    product_description: String,
    product_price:{type:Number,required:true},
    product_quantity:{type:Number,required:true},
    product_type:{type:String,required:true,enum:['Electronics','Clothing','Furniture']},
    product_shop:{type:Schema.Types.ObjectId,ref:'Shop'},
    product_attributes:{type:Schema.Types.Mixed,required:true}
},{
    collection:PRODUCT_COLLECTION
});
const clothingSchema = new Schema({
    brand:{type:String,required:true},
    size:{type:String,required:true},
    material:{type:String,required:true},
    product_shop:{type:Schema.Types.ObjectId,ref:'Shop'}
},{
    timestamps:true,
    collection:CLOTHING_COLLECTION
})

const electronicSchema = new Schema({
    manufacturer:{type:String,required:true},
    model:{type:String,required:true},
    color:{type:String,required:true},
    product_shop:{type:Schema.Types.ObjectId,ref:'Shop'}
},{
    timestamps:true,
    collection:ELECTRONIC_COLLECTION
})
//Export the model
module.exports = {
    product : model(PRODUCT_DOCUMENT,productSchema),
    clothing : model(CLOTHING_DOCUMENT,clothingSchema),
    electronic : model(ELECTRONIC_DOCUMENT,electronicSchema)
}