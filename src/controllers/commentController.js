const { OK } = require("../core/success.response")
const CommentService = require("../services/comment.service")

class CommentController {
    static addComment = async (req,res,next) => {
        const {userId} = req.user;
        new OK({metaData:await CommentService.addComment({userId,...req.body})}).send(res)
    }
    static addReply = async (req,res,next) => {
        const {userId} = req.user;
        new OK({metaData:await CommentService.addReply({userId,...req.body})}).send(res)
     }
     static getCommentByProduct = async(req,res,next) => {
        const {productId} = req.params;
        new OK({metaData:await CommentService.getCommentByProduct({productId})}).send(res)
     }
}   
module.exports = CommentController