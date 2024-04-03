import mongoose  from "mongoose";

const LikeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    likeableId:{
        type: mongoose.Schema.Types.ObjectId,
        refPath: "comORpost_model",
        required: true,
    },
    comORpost_model:{
        type: String,
        required: true,
        enum: ["Comment", "Post"]
    },
    LikeGivenDate:{
        type: Date,
        default: Date.now()
    }
})

export default LikeSchema;