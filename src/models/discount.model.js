const {Schema,Types,model} = require('mongoose'); // Erase if already required
const { DISCOUNT_COLLECTION, DISCOUNT_DOCUMENT, SHOP_DOCUMENT } = require('../constant/document.const');
var discountSchema = new Schema({
    discount_code:{type:String,required:true},
    discount_name:{type:String,required:true},
    discount_description:String,
    discount_type:{type:String,required:true,default:'mixed_price',enums:['mixed_price','percentage']},
    discount_value:{type:Number,required:true},
    discount_min_order_value:{type:Number,required:true},
    discount_max_uses:{type:Number,required:true},
    discount_max_user_uses:{type:Number,required:true},
    discount_uses_count:{type:Number,required:true},
    discount_user_used:{type:Array,default:[]},
    discount_applies_to:{type:String,default:'all',enums:['all','specific']}, 
    discount_product_ids:{type:Array,default:[]},
    discount_start_date:{type:Date,required:true},
    discount_end_date:{type:Date,required:true},
    discount_is_active:{type:Boolean,default:true},
    discount_shopId:{type:Types.ObjectId,ref:SHOP_DOCUMENT}
},{
    timestamps:true,
    collection:DISCOUNT_COLLECTION
});
//Export the model
module.exports = model(DISCOUNT_DOCUMENT, discountSchema);