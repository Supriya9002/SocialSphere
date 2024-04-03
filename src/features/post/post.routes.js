import express from 'express'
import PostController from "./post.controller.js"
import uplodeFile from "./../../middleware/fileupload.middleware.js"

//Express router
const postRouter = express.Router();

//instance
const postController =new PostController();

// All the paths to controller methods.
postRouter.get("/all", (req, res)=>{
    postController.getAllPost(req, res) //getAllPost
})
postRouter.post("/", uplodeFile.single("imageUrl") ,(req, res)=>{ 
    postController.addPost(req, res)
})
postRouter.get("/:postId", (req, res)=>{
    postController.getOnePost(req, res)
})
postRouter.get("/", (req, res)=>{
    postController.getPost(req, res)
})
postRouter.put("/:postId", uplodeFile.single("imageUrl"), (req, res)=>{
    postController.updatePost(req, res)
})
postRouter.delete("/:postId", (req, res)=>{
    postController.deletePost(req, res)
})



export default postRouter;