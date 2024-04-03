import CommentRepository from "./comment.repository.js"
import ApplicationError from "./../../error/applicationError.js"

export default class CommentController{

    constructor(){
        this.commentRepository = new CommentRepository();
    }

    //Add Comment
    async addComment(req, res){
        try{
            //console.log(req.userID, req.params.postId, req.body.content);
            const addcomment = await this.commentRepository.add(req.userID, req.params.postId, req.body.content);
            res.status(201).send(addcomment);
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500);
        }
    }
    
    //get comment for specific post
    async get_Specific_Comment(req, res){
        try{
            const getComment = await this.commentRepository.get_comment(req.params.postId);
            res.status(200).send(getComment)
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500);
        }
    }

    // delete Comment 
    async deleteComment(req, res){
        try{
            //console.log("A lo supriya",req.userID, req.params.commentId)
            const deletePost = await this.commentRepository.delete(req.userID, req.params.commentId)
            if(deletePost){
                res.status(201).send("Comment Deleted");
            }else{
                res.status(404).send("Not found Post");
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500);
        }
    }

    // update Comment
    async updateComment(req, res){
        try{
            const updatePost = await this.commentRepository.update(req.userID, req.params.commentId, req.body.content)
            if(updatePost){
                res.status(201).send(updatePost);
            }else{
                res.status(404).send("Comment Not found");
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500);
        }
    } 

}