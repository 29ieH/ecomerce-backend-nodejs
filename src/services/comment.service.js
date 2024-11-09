const { BadRequestError } = require("../core/error.response");
const CommentRepository = require("../models/repositories/comment.repository");
const { convertToObjectIdMongo } = require("../utils");

class CommentService {
  static createComment = async ({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) => {
    if (parentCommentId == null) {
      let leftValue = 1;
      let rightValue = 2;
      const result = await CommentRepository.createComment({
        productId,
        userId,
        content,
        leftValue,
        rightValue,
      });
      return result;
    } else {
      let parentId = convertToObjectIdMongo(parentCommentId);
      const parent = await CommentRepository.getComment({ parentId });
      if (!parent) throw new BadRequestError({ message: "Comment not found" });
      const maxRight =
        (await CommentRepository.getMaxRighChildComment(productId)) ||
        parent.rightValue;
      let leftValue = maxRight;
      let rightValue = leftValue + 1;
      const childComment = await CommentRepository.createComment({
        productId,
        userId,
        content,
        parentId,
        leftValue,
        rightValue,
      });
      if (!childComment)
        throw new BadRequestError({
          message: "Something wrong!!!, pls try again",
        });
      const updateValue = await CommentRepository.updateValueComment(
        productId,
        childComment.leftValue,
        childComment.rightValue
      );
      if (!updateValue)
        throw new BadRequestError({
          message: "Something Wrong!!!, pls try again",
        });
      return childComment;
    }
  };
}
module.exports = CommentService;
