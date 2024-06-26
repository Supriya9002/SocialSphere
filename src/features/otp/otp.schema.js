
import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    otp:{
        type:String,
        //required: true
    },
    expiresAt:{
        type: Date,
        //required: true
    }
})

export default OtpSchema;