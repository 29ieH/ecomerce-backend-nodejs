const {mongoose, Types , Schema, Collection } = require('mongoose'); // Erase if already required
const { USER_DOCUMENT } = require('../constant/document.const');

const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "Shops";    
var shopSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        maxLength:150
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['active','inactive']
        ,default:'inactive'
    },
    verify:{
        type:Schema.Types.Boolean,
        default:false
    },
    user:{
        type:Types.ObjectId,
        ref:USER_DOCUMENT,
        required:true
    }
},{
    timestamps:true,
    collection: COLLECTION_NAME
});
//Export the model
module.exports = mongoose.model(DOCUMENT_NAME,shopSchema);