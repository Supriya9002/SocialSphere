import express from "express"
import CommentController from "./comment.controller.js"

const commentRouter = express.Router();

const commentController = new CommentController();

commentRouter.post("/:postId", (req, res)=>{
    commentController.addComment(req, res)
})
commentRouter.get("/:postId", (req, res)=>{
    commentController.get_Specific_Comment(req, res)
})
commentRouter.delete("/:commentId", (req, res)=>{
    commentController.deleteComment(req, res)
})
commentRouter.put("/:commentId", (req, res)=>{
    commentController.updateComment(req, res)
})



export default commentRouter;