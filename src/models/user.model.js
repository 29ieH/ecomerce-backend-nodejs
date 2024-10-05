const {Schema,Types,model} = require('mongoose'); // Erase if already required
const {USER_DOCUMENT, USER_COLLECTION } = require('../constant/document.const');
const enumsDocument = require('../constant/enums.const');
const { equalsArrayAll } = require('../utils');
const {BadRequestError} = require('../core/error.response');
const {toArraySlugify} = require('../utils')
// Declare the Schema of the Mongo model
var userSchemal = new Schema({
    name:{
        type:String,
        required:true,
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
    address:{
        type:String
    },
    status:{
        type:String,
        enums:['active','inactive','banned'],
        default:'active'
    },
    role:{
        type:Array,
        default:['USER']
    }
},{
    collection:USER_COLLECTION,
    timestamps:true
});
//Export the model
module.exports = model(USER_DOCUMENT, userSchemal);