import PostRepository from "./post.repository.js"
import ApplicationError from "./../../error/applicationError.js"


export default class PostController{

    constructor(){
        this.postRepository = new PostRepository();
    }

    // Add Post
    async addPost(req, res){
        try{
            console.log(req.file.filename);
            const post = {userId: req.userID ,caption: req.body.caption, imageUrl: req.file.filename}
            const newpost = await this.postRepository.add(post)
            res.status(201).send(newpost);
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    // getOne Post by id, all user see, this post
    async getOnePost(req, res){
        try{
            //console.log(req.params.postId)
            const post = await this.postRepository.getOne(req.params.postId);
            //console.log(post)
            if(!post){
                res.status(404).send("Post Not Found");
            }else{
                res.status(200).send(post)
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    // get all Posts for user Specific
    async getPost(req, res){
        try{
            const userID = req.userID;
            console.log("A LO Userid", userID)
            const posts = await this.postRepository.getPost(userID);
            if(!posts){
                res.status(404).send("You Can not Create Any Post")
            }
            else{
                res.status(200).send(posts);
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    // all Users see each other Post, all post show
    async getAllPost(req, res){
        try{
            console.log("Supriya Haldar")
            const allPost = await this.postRepository.get_AllPost();
            console.log(allPost);
            res.status(200).send(allPost);
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    // delete specific Post by user
    async deletePost(req, res){
        try{
            const userID = req.userID;
            const deletePost = await this.postRepository.delete(userID, req.params.postId);
            if(deletePost){
                res.status(200).send('Post Delete')
            }else{
                res.status(404).send("Not found Post")
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    // update specific Post by user
    async updatePost(req, res){
        try{
            const userID = req.userID;
            const updatePost = await this.postRepository.update(userID, req.params.postId, req.body);
            if(updatePost){
                res.status(200).send("Post Updated")
            }else{
                res.status(404).send("Post Not found")
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

}