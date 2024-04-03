
import mongoose from "mongoose";

const FriendShipSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    friendId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    // createdAt: { type: Date, default: Date.now },
    // updatedAt: { type: Date, default: Date.now },   
    timestamps: {
        createdAt: { type: Date},
        updatedAt: {type: Date}
    }
}) 
 
export default FriendShipSchema;