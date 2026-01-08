import express from "express";
import CommentController from "./comment.controller.js";
import jwtAuth from "../../middleware/jwt.middleware.js";

const commentRouter = express.Router();

const commentController = new CommentController();

commentRouter.post("/:postId", jwtAuth, (req, res) => {
  commentController.addComment(req, res);
});
commentRouter.get("/:postId", jwtAuth, (req, res) => {
  commentController.get_Specific_Comment(req, res);
});
commentRouter.delete("/:commentId", jwtAuth, (req, res) => {
  commentController.deleteComment(req, res);
});
commentRouter.put("/:commentId", jwtAuth, (req, res) => {
  commentController.updateComment(req, res);
});

export default commentRouter;
