import express from "express";
import LikeController from "./like.controller.js";
import jwtAuth from "../../middleware/jwt.middleware.js";

const likeRouter = express.Router();

//instance
const likeController = new LikeController();

likeRouter.get("/:id", jwtAuth, (req, res) => {
  likeController.getLike(req, res);
});
likeRouter.get("/toggle/:id", jwtAuth, (req, res) => {
  likeController.toggleLike(req, res);
});

export default likeRouter;
