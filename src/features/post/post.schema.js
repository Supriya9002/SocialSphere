import mongoose from "mongoose";

const PostSchema =new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    caption: {
        type: String,
    },
    imageUrl:{
        type: String,
    },
    PostCreateDate:{
        type: Date,
        default: Date.now()
    },
    commentId:[{
        type: mongoose.Schema.ObjectId,
        ref: "comment",
        required: true,
    }],
    postlikeId:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "like"
    }]
})

export default PostSchema;
