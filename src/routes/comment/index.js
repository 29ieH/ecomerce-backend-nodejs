const app = require('express');
const { asyncHandler } = require('../../helpers/handleUtils');
const CommentController = require('../../controllers/commentController');
const { authenticationV2 } = require('../../auth/authUtils');
const router = app.Router();
router.get("/:productId",asyncHandler(CommentController.getCommentByProduct))
router.use(authenticationV2)
router.post("",asyncHandler(CommentController.addComment))
router.post("/reply",asyncHandler(CommentController.addReply))
module.exports = router;