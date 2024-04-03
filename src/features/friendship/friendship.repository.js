
import mongoose from "mongoose";
import FriendShipSchema from "./friendship.schema.js"

//model
const friendshipModel = mongoose.model("friend", FriendShipSchema)

export default class FriendShipRepository{

    //get user friends
    async getFriends(userID){
        try{
            return await friendshipModel.find({userId: userID, status: "accepted"}) //.populate("friendId");
        }catch(err){
            console.log(err)
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    //get pending request
    async pending_Request(userID){
        try{
            return await friendshipModel.find({userId: userID, status: "pending"}) //.populate("friendId");
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500);
        }
    }

    //toggle_friendship
    async toggle_friendship(userID ,friendID){
        try{
            const existingFriendship = await friendshipModel.findOne({userId: userID, friendId: friendID});
            if(existingFriendship){
                existingFriendship.status = existingFriendship.status === 'accepted' ? 'pending' : 'accepted';
                existingFriendship.timestamps.updatedAt = Date.now();
                return await existingFriendship.save();
            }else{
                const newtoggle =new friendshipModel(
                    {
                        userId: userID, 
                        friendId: friendID, 
                        status: "pending", 
                        timestamps: {
                            createdAt: Date.now()
                        }
                    })
                return await newtoggle.save();
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    //responce to request
    async responce_to_request(userID, friendID, status){
        try{
            const friend = await friendshipModel.findOne({userId: userID, friendId: friendID, status: "pending"});
            console.log("A lo Friend", friend);
            if(friend){
                friend.status = status;
                friend.timestamps.updatedAt = Date.now();
                return await friend.save();
            }else{
                throw new ApplicationError("Friend request not found", 404);
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }
}