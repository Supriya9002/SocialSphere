import express from "express";
import PostController from "./post.controller.js";
import uplodeFile from "./../../middleware/fileupload.middleware.js";
import jwtAuth from "../../middleware/jwt.middleware.js";

//Express router
const postRouter = express.Router();

//instance
const postController = new PostController();

// All the paths to controller methods.
postRouter.get("/all", (req, res) => {
  postController.getAllPost(req, res); //getAllPost
});
postRouter.post("/", jwtAuth, uplodeFile.single("imageUrl"), (req, res) => {
  // console.log("req.file", req.file);
  postController.addPost(req, res);
});
postRouter.get("/:postId", (req, res) => {
  postController.getOnePost(req, res);
});
postRouter.get("/", jwtAuth, (req, res) => {
  postController.getPost(req, res);
});
postRouter.put("/:postId",jwtAuth, uplodeFile.single("imageUrl"), (req, res, next) => {
  postController.updatePost(req, res, next);
});
postRouter.delete("/:postId", jwtAuth, (req, res) => {
  postController.deletePost(req, res);
});

export default postRouter;
