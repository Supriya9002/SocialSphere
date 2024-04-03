import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    CommentCreateDate:{
        type: Date,
        default: Date.now()
    },
    commentlikeId:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "like"
    }]
})

export default CommentSchema;