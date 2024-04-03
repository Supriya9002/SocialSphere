import mongoose from "mongoose";
import PostSchema from "./post.schema.js"
import ApplicationError from "./../../error/applicationError.js"

//model
const PostModel = mongoose.model("post", PostSchema);

export default class PostRepository{

    // Add Post
    async add(post){
        try{
            const newPost = new PostModel(post);
            return await newPost.save();
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    // getOne post by id, all user see, this post
    async getOne(postID){
        try{
            return await PostModel.findById(postID)
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    // get all Posts for user Specific
    async getPost(userID){
        try{
            return await PostModel.find({userId: userID});
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    // all user see Posts (can see all others posts)
    async get_AllPost(){
        try{
            return await PostModel.find();
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    // delete specific Post by user
    async delete(userID, postID){
        try{
            return await PostModel.deleteOne({_id: postID, userId: userID});
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    // update specific Post by user
    async update(userID, postID, updateData){
        try{
            return await PostModel.updateMany({_id: postID, userId: userID},{caption: updateData.caption, imageUrl: updateData.imageUrl})
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

}