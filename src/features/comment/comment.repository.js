import mongoose from "mongoose";
import CommentSchema from "./comment.schema.js";
import ApplicationError from "./../../error/applicationError.js"
import PostSchema from "./../post/post.schema.js"

//model
const CommentModel = mongoose.model("comment", CommentSchema)
const PostModel = mongoose.model("post", PostSchema);


export default class CommentRepository{
    async add(userID, postID, content){
        try{
            const post = await PostModel.findOne({_id: postID})
            if(!post){
                return "PostId Not found"
            }
            const comment = new CommentModel({userId: userID, postId: postID, content: content});
            const saveComment = await comment.save();
            const result =await PostModel.updateOne(
                {_id:postID},
                {$push: {commentId: saveComment._id}}
            )
            //console.log(result)
            return saveComment
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500);
        }
    }

    async get_comment(postID){
        try{
            const comment = await CommentModel.find({postId: postID}).select({content: 1, _id: 0})
            //console.log(comment)
            return comment;
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }
    
    //delete comment
    async delete(userID, commentID){
        try{
            const postComment = await CommentModel.findOne({_id: commentID, userId: userID})
            if(!postComment){
                //console.log("Supriya")
                return null;
            }
            const postID = postComment.postId;
            await CommentModel.deleteOne({_id: commentID})
            const post = await PostModel.findByIdAndUpdate(
                {_id: postID},
                {$pull: {commentId: commentID}}
            )
            //console.log("A ROKI",postComment, "A Moni", postID, "A Guru", post)
            return true;
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    //Update Comment
    async update(userID, commentID, content){
        try{
            const comment = await CommentModel.findOne({_id: commentID, userId: userID})
            if(!comment){
                return null;
            }
            comment.content = content;
            const saveComment = await comment.save();
            return saveComment;
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

}