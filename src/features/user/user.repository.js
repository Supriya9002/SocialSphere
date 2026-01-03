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

    async findUserWithToken(userId, token) {
        try {
            return await UserModel.findOne({ _id: userId, sessions: token });
        } catch (err) {
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500);
        }
    }

    async logout(userID, sessionToken){
        try{
            const result = await UserModel.findByIdAndUpdate(
                userID,
                {$pull: {sessions: sessionToken}},
                { new: true }
            )
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
                {$set: {sessions: []}},
                { new: true }
            )
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
    async getDetails_All_User({ page = 1, limit = 10, search, sort, gender } = {}){
        try{
            const skip = (page - 1) * limit;
            const query = {};
            
            // Search
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }
            
            // Filter
            if (gender) {
                query.gender = gender;
            }

            // Sort
            let sortQuery = {};
            if (sort) {
                const field = sort.startsWith('-') ? sort.substring(1) : sort;
                const order = sort.startsWith('-') ? -1 : 1;
                sortQuery[field] = order;
            }

            return await UserModel.find(query)
                .select({password: 0, date: 0, sessions: 0, __v: 0})
                .sort(sortQuery)
                .skip(skip)
                .limit(parseInt(limit));
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