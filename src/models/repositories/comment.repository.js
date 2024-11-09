const commentModel = require("../comment.model");

class CommentRepository {
  static checkExistComment = async ({ filter }) => {
    return await commentModel.findOne(filter).lean();
  };
  static getComment = async (filter) => {
    return await commentModel.findOne(filter);
  };
  static createComment = async (body) => {
    return await commentModel.create(body);
  };
  static getCommentByProduct = async ({
    productId,
    limit = 20,
    page = 1,
    sort,
  }) => {
    const skip = (page - 1) * limit;
    return await commentModel
      .find({
        productId,
      })
      .populate("userId", "name")
      .populate("replies.userId", "name")
      .limit(limit)
      .skip(skip)
      .sort(sort);
  };
  static getMaxRighChildComment = async (productId) => {
    return await commentModel
      .find({ productId })
      .sort({
        rightValue: -1,
      })
      .select({
        rightValue: 1,
      });
  };
  static updateValueComment = async (productId, leftValue, rightValue) => {
    const filter = {
        productId,
        leftValue: { $lt: leftValue },
        rightValue: { $lte: rightValue },
      },
      body = {
        $inc: {
          rightValue: 2,
        },
      },
      options = {
        new: true,
      };
    return await commentModel.updateMany(filter, body, options);
  };
}
module.exports = CommentRepository;
