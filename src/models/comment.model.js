const {Schema,model,Types} = require('mongoose'); // Erase if already required
const { COMMENT_DOCUMENT, PRODUCT_DOCUMENT, USER_DOCUMENT, COMMENT_COLLECTION } = require('../constant/document.const');

// Declare the Schema of the Mongo model
var commentSchema = new Schema({
    productId:{
        type:Types.ObjectId,
        required:true,
        ref:PRODUCT_DOCUMENT
    },
    userId:{
        type:Types.ObjectId,
        required:true,
        ref:USER_DOCUMENT
    },
    content:{
        type:String,
        required:true
    },
    replies:[{
        userId:{
            type:Types.ObjectId,
            ref:USER_DOCUMENT
        },
        content:{
            type:String,
            required:true
        },
        createdAt: { type: Date, default: Date.now }
    }
    ]
},{
    collection:COMMENT_COLLECTION,
    timestamps:true
});

//Export the model
module.exports = model(COMMENT_DOCUMENT, commentSchema);