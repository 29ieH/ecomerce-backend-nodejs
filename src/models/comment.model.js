const { Schema, model, Types } = require("mongoose"); // Erase if already required
const {
  COMMENT_DOCUMENT,
  PRODUCT_DOCUMENT,
  USER_DOCUMENT,
  COMMENT_COLLECTION,
} = require("../constant/document.const");

// Declare the Schema of the Mongo model
var commentSchema = new Schema(
  {
    productId: {
      type: Types.ObjectId,
      required: true,
      ref: PRODUCT_DOCUMENT,
    },
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: USER_DOCUMENT,
    },
    parentId: {
      type: Types.ObjectId,
      ref: COMMENT_DOCUMENT,
    },
    content: {
      type: String,
      required: true,
    },
    leftValue: {
      type: Number,
      required: true,
    },
    rightValue: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: COMMENT_COLLECTION,
    timestamps: true,
  }
);

//Export the model
module.exports = model(COMMENT_DOCUMENT, commentSchema);
