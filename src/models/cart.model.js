const {Schema,Types,model} = require('mongoose'); // Erase if already required
const { CART_DOCUMENT, CART_COLLECTION } = require('../constant/document.const');

// Declare the Schema of the Mongo model
var CartSchema = new Schema({
    cartState:{
        type:String,
        required:true,
        enums:['active','failed','pending'],
        default:'active'
    },

    /*
        Product Items
        {
            "productId":"zzz",
            "name":"abc",
            "quanity":2,
            "shopId":"abcz"
        }
    */
    cartProducts:{
        type:Array,
        default:[],
        required:true
    },
    cartCountProduct:{
        type:Number,
        default:0
    },
    cartUserId:{
        type:String,
        required:true,
    }
},{
    collection:CART_COLLECTION,
    timestamps:true
});

//Export the model
module.exports = model(CART_DOCUMENT, CartSchema);