const {Schema,model} = require('mongoose'); // Erase if already required
const {PERMISSION_DOCUMENT, PERMISSION_COLLECTION } = require('../constant/document.const');
const enumsDocument = require('../constant/enums.const');
const slugify = require('slugify')
const { BadRequestError } = require("../core/error.response")
// Declare the Schema of the Mongo model
var permissionSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    description:{
        type:String
    }
},{
    collection:PERMISSION_COLLECTION,
    timestamps:true
});
// permissionSchema.pre('save',function (next){
//     if(this.name){
//         this.name = slugify(this.name.toUpperCase())
//         console.log(this.name)
//         if(!enumsDocument.PERMISSION.includes(this.name)){
//            return next(new BadRequestError('Permission name is not valid'))
//         }
//     }
//     next();
// })
//Export the model
module.exports = model(PERMISSION_DOCUMENT, permissionSchema);