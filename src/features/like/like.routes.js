
import express from "express"
import LikeController from "./like.controller.js"

const likeRouter = express.Router();

//instance
const likeController = new LikeController();

likeRouter.get("/:id", (req, res)=>{
    likeController.getLike(req, res)
})
likeRouter.get("/toggle/:id", (req, res)=>{
    likeController.toggleLike(req, res)
})

export default likeRouter;