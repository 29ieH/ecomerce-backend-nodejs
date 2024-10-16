const {Schema,model} = require('mongoose'); // Erase if already required
const document = require('../constant/document.const')
const slugify = require('slugify')
const productSchema = new Schema({
    product_name : {type:String,required:true},
    product_thumb: {type:String,required:true},
    product_description: String,
    product_slug:String,
    product_price:{type:Number,required:true},
    product_quantity:{type:Number,required:true,default:0},
    product_type:{type:String,required:true,enum:['electronics','clothing','furniture']},
    product_shop:{type:Schema.Types.ObjectId,ref:'Shop'},
    product_attributes:{type:Schema.Types.Mixed,required:true},
    isDrafts:{type:Boolean,default:true,select:false},
    isPublished:{type:Boolean,default:false,select:false},
    product_rating:{
        type:Number,
        min:[1,'Rating must be above 1.0'],
        max:[5,'Rating must be under 5.0'],
        set: (val) => Math.round(val*10)/10
    },
    product_variations:{type:Array,default:[]}
},{
    collection:document.PRODUCT_COLLECTION
});
productSchema.pre('save',function(next){
    if(this.product_name){
        this.product_slug = slugify(this.product_name,{
            lower:true,
            strict:true
        });
    }
    next();
})
productSchema.index({
    "product_name":"text",
    "product_description":"text"
})
const clothingSchema = new Schema({
    brand:{type:String,required:true},
    size:{type:String,required:true},
    material:{type:String,required:true},
    product_shop:{type:Schema.Types.ObjectId,ref:'Shop'}
},{
    timestamps:true,
    collection:document.CLOTHING_COLLECTION
})

const electronicSchema = new Schema({
    manufacturer:{type:String,required:true},
    model:{type:String,required:true},
    color:{type:String,required:true},
    product_shop:{type:Schema.Types.ObjectId,ref:'Shop'}
},{
    timestamps:true,
    collection:document.ELECTRONIC_COLLECTION
})
//Export the model
module.exports = {
    product:model(document.PRODUCT_DOCUMENT,productSchema),
    clothing:model(document.CLOTHING_DOCUMENT,clothingSchema),
    electronic:model(document.ELECTRONIC_DOCUMENT,electronicSchema)
}