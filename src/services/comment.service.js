const { BadRequestError } = require("../core/error.response");
const CommentRepository = require("../models/repositories/comment.repository");
const { convertToObjectIdMongo } = require("../utils");

class CommentService{
    static addComment  = async({
        userId,productId,content
    }) => {
        return await CommentRepository.createComment({
            userId,productId,content
        });
    }
    static addReply = async ({
        userId,commentId,content
    }) => {
        console.log({userId,commentId,content})
        const commentParent = await CommentRepository.getComment({
            _id:commentId
        });
        if(!commentParent) throw new BadRequestError({message:'Wrong something, pls trying'})
        const reply = {
            userId,
            content
        }
        console.log("Reply:: ",reply)
        commentParent.replies.push(
            reply
        )
        return await commentParent.save();
    }
    static getCommentByProduct = async({productId,limit,page,sort='asc'}) => {
        const sortBy = sort == 'asc' ? {'_v':1} : {'createdAt':1};
        return await CommentRepository.getCommentByProduct({productId:convertToObjectIdMongo(productId),limit,page,sort:sortBy})
    }
}
module.exports = CommentService