
import jwt from 'jsonwebtoken';
import userSchema from "./../features/user/user.schema.js"
import mongoose from 'mongoose';
import ApplicationError from "./../error/applicationError.js"

const UserModel= mongoose.model("User", userSchema)

const jwtAuth = (req, res, next)=>{
    // 1. Read the token.
    //console.log("A lo req.headers",req.headers);
    const token = req.headers['authorization'];
    //console.log("a lo token",token);

    // 2. if no token, return the error.
    if(!token){
        return res.status(401).send('Unauthorized');
    }
    // 3. check if token is valid.
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Check if the user associated with the token exists and if the token is still valid
        const user = UserModel.findOne({_id: payload.userID, sessions: token});
        //console.log("A lo user in jwt.middleware: ", user)
        if(!user){
            throw new ApplicationError('Unauthorized', 401);
        }
        req.userID = payload.userID;
        console.log(payload);
        console.log("A lo req.userID :", req.userID);
    } catch(err){
        // 4. return error.
        console.log(err);
        return res.status(401).send('Unauthorized');
    }
    // 5. call next middleware.
    next();
};

export default jwtAuth;