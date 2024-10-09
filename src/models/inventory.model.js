const {model,Schema, Types} = require('mongoose'); // Erase if already required
const { INVENTORY_COLLECTION, PRODUCT_DOCUMENT, SHOP_DOCUMENT, INVENTORY_DOCUMENT } = require('../constant/document.const');

// Declare the Schema of the Mongo model
var inventorySchema = new Schema({
    productId:{
        type:Types.ObjectId,
        ref:PRODUCT_DOCUMENT,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    address:{
        type:Object,
        default:{}
    },
    shopId:{
        type:Types.ObjectId,
        ref:SHOP_DOCUMENT,
        required:true
    }
},{ 
    collection:INVENTORY_COLLECTION,
    timestamps:true
});
//Export the model
module.exports = model(INVENTORY_DOCUMENT, inventorySchema);