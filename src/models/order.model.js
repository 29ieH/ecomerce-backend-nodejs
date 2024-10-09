const {model,Schema,Types} = require('mongoose'); // Erase if already required
const { ORDER_DOCUMENT, ORDER_COLLECTION, USER_DOCUMENT } = require('../constant/document.const');

// Declare the Schema of the Mongo model
var orderSchema = new Schema({
    userId:{
        type:Types.ObjectId,
        ref:USER_DOCUMENT,
        required:true
    },
    orderItems:{
        types:Array,
        required:true,
        default:[]
    },
    totalOrder:{
        types:Object,
        required:true,
        default:{}
    },
    paymentMethods:{
        type:String,
        enums:['COD','Credit card','Paypal'],
        required:true
    },
    address:{
        type:Object,
        required:true
    },
    status:{
        type:String,
        enums:['Processing','Accepted','Pending'],
        default:'Processing'
    },
    notes:{
        type:String
    }
},{
    collection:ORDER_COLLECTION,
    timestamps:true
});
//Export the model
module.exports = model(ORDER_DOCUMENT, orderSchema);