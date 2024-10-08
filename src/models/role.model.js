const {Schema,Types,model} = require('mongoose'); // Erase if already required
const { ROLE_DOCUMENT, ROLE_COLLECTION } = require('../constant/document.const');
const { type } = require('express/lib/response');
const enumsDocument = require('../constant/enums.const');
const { equalsArrayAll } = require('../utils');
const {BadRequestError} = require('../core/error.response');
const {toArraySlugify} = require('../utils')
// Declare the Schema of the Mongo model
var roleSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    description:{
        type:String
    },
    permissions:{
        type:Array,
        default:[],
            
    }
},{
    collection:ROLE_COLLECTION,
    timestamps:true
});
// roleSchema.pre('save',function (next) {
//     if(this.name){
//         this.name = this.name.toUpperCase();
//         console.log("Name:: ",this.name)
//         if(!enumsDocument.ROLE.includes(this.name)) 
//             return next(new BadRequestError('Name is not valid'))
//     }
//     if(this.permissions.length>0){
//         this.permissions = toArraySlugify(this.permissions)
//         console.log("Permission:: ",this.permissions)
//         if(!equalsArrayAll(enumsDocument.PERMISSION,this.permissions)) 
//             return next(new BadRequestError('Permission is not valid'))        
//     }
//     next();
// })
//Export the model
module.exports = model(ROLE_DOCUMENT, roleSchema);