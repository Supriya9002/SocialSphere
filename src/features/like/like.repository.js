import LikeSchema from "./like.schema.js"
import mongoose from "mongoose";
import ApplicationError from "./../../error/applicationError.js"
import PostSchema from "./../post/post.schema.js"
import CommentSchema from "./../comment/comment.schema.js"
//import { ObjectId } from "mongoose";

//model
const LikeModel = mongoose.model("like", LikeSchema)
const PostModel = mongoose.model("post", PostSchema);
const CommentModel = mongoose.model("comment", CommentSchema)

export default class LikeRepository{

    //get Like for specific Post or comment
    async get_Like(id, type){
        try{
            if(type == "Comment"){
                const result =  await CommentModel.findOne({_id: new mongoose.Types.ObjectId(id)})
                return result.commentlikeId;
            }
            if(type == "Post"){
                const result=  await PostModel.findOne({_id: new mongoose.Types.ObjectId(id)})
                return result.postlikeId;
            }
            
        }catch(err){
            console.log(err);
            //throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    //user Like or DisLike on Post Or comment 
    async likeComment(commentID, type, userID){
        try{
            //1. check comment (like or unlike), if present means comment (like)
            const like = await LikeModel.findOne(
                {
                    userId: new mongoose.Types.ObjectId(userID), 
                    likeableId: new mongoose.Types.ObjectId(commentID), 
                    comORpost_model: type
                }
            )
            console.log("A lo Like", like, "A lo type", type)
            if(like){
                //2. Delete like
                //check
                const result  = await LikeModel.deleteOne(
                    {
                        userId: new mongoose.Types.ObjectId(userID), 
                        likeableId: new mongoose.Types.ObjectId(commentID), 
                        comORpost_model: type
                    }
                )
                //Or use, below same logic
                //await LikeModel.deleteOne({_id: like._id});

                //3. delete likeid in commentModel
                await CommentModel.updateOne(
                    {_id: new mongoose.Types.ObjectId(commentID)},
                    {$pull: {commentlikeId: like._id}}
                )
                return {msg: "Comment Unliked Succesfull"};
            }
            else{
                //4. create like in likeModel
                const newLike = new LikeModel({
                    userId: new mongoose.Types.ObjectId(userID),
                    likeableId: new mongoose.Types.ObjectId(commentID),
                    comORpost_model: type
                })
                const saveLike = await newLike.save();
                //5. push likeid in commentModel
                await CommentModel.updateOne(
                    {_id: new mongoose.Types.ObjectId(commentID)},
                    {$push: {commentlikeId:new mongoose.Types.ObjectId(saveLike._id)}}
                )
                return {msg: "Comment Liked Succesfull"};
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }
    async likePost(postID, type, userID){
        try{
            //1. check comment (like or unlike), if present means comment (like)
            console.log(type)
            const like = await LikeModel.findOne(
                {
                    userId: new mongoose.Types.ObjectId(userID), 
                    likeableId: new mongoose.Types.ObjectId(postID), 
                    comORpost_model: type
                }
            )
            if(like){
                //2. Delete like
                await LikeModel.deleteOne(
                    {
                        userId: new mongoose.Types.ObjectId(userID), 
                        likeableId: new mongoose.Types.ObjectId(postID), 
                        comORpost_model: type
                    }
                )
                //Or use, below same logic
                //await LikeModel.deleteOne({_id: like._id});

                //3. delete likeid in commentModel
                await PostModel.updateOne(
                    {_id: new mongoose.Types.ObjectId(postID)},
                    {$pull: {postlikeId: like._id}}
                )
                return {msg: "Post Unliked Succesfull"};
            }
            else{
                //4. create like in likeModel
                const newLike = new LikeModel({
                    userId: new mongoose.Types.ObjectId(userID),
                    likeableId: new mongoose.Types.ObjectId(postID),
                    comORpost_model: type
                })
                const saveLike = await newLike.save();
                console.log(saveLike);
                //5. push likeid in commentModel
                await PostModel.updateOne(
                    {_id: new mongoose.Types.ObjectId(postID)},
                    {$push: {postlikeId: new mongoose.Types.ObjectId(saveLike._id)}}
                )
                return {msg: "Post Liked Succesfull"};
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }
}