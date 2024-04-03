import mongoose from "mongoose"
import userSchema from "./user.schema.js"
import ApplicationError from "./../../error/applicationError.js"

//model
const UserModel= mongoose.model("User", userSchema)

export default class UserRepostory{

    async signup(user){
        try{
            const newuser = new UserModel(user);
            return await newuser.save();
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }
    async findEmail(email){
        try{
            return await UserModel.findOne({email});
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }
    async logout(userID, sessionToken){
        try{
            //Hare code
            
            const result = await UserModel.findByIdAndUpdate(
                userID,
                {$pull: {sessions: sessionToken}}
            )
            //console.log(result)
            await result.save();
            return result;
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    async logoutAllDevice(userID, sessionToken){
        try{
            const result = await UserModel.findByIdAndUpdate(
                userID,
                {$set: {sessions: []}}
            )
            //console.log(result)
            await result.save();
            return result;
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    async getDetails_byId(id){
        try{
            return await UserModel.findOne({_id: id}).select({password: 0, date: 0, sessions: 0, _id: 0, __v: 0}); // in mogodb use project(), in mongoose use select(), password not show
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }
    async getDetails_All_User(){
        try{
            return await UserModel.find().select({password: 0, date: 0, sessions: 0, _id: 0, __v: 0})
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }
    async update_details(userId, updateData){
        try{
            //write hare code
            const user = await UserModel.findById(userId);
            if(!user){
                return null;
            }
            //console.log("A vai: ", user)
            // Update the user data
            await Object.assign(user, updateData);
            const saveData = await user.save();
            return {
                _id: saveData._id,
                name: saveData.name,
                email: saveData.email,
                gender: saveData.gender,
                avatar: saveData.avatar
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }
}