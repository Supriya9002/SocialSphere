import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        maxLength: [25, "Name can't be greater than 25 characters"],
        minLength: [3, "The name should be at least 3 characters long"],
    },
    email:{
        type: String,
        required: [true, "email is required"],
        match: [/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/],
        unique: true
    },
    password:{
        type: String,
        required: true,
        // validate:{
        //     validator: function(value){
        //         return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value)
        //     },
        //     message:"Password should be between 8-12 charachetrs and have a special character"
        // }
    },
    gender:{
        type: String,
        required:true,
        enum: ["Male", "Female", "Transgender"]
    },
    avatar: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    sessions:[{
        type: String 
    }]
})

export default userSchema; 