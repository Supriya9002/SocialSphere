
import FriendShipRepository from "./friendship.repository.js"
import ApplicationError from "./../../error/applicationError.js"

export default class FriendShipController{

    constructor(){
        this.friendShipRepository = new FriendShipRepository()
    }

    //get user friends
    async getFriends(req, res){
        try{
            //const userId = req.userID;
            const friends = await this.friendShipRepository.getFriends(req.params.userId);
            console.log(req.params.userId, friends)
            res.status(200).send(friends);
        }catch(err){
            console.log(err)
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    //get pending request
    async pendingRequest(req, res){
        try{
            const userId = req.userID;
            const pendingFriendRequest = await this.friendShipRepository.pending_Request(userId);
            console.log(userId, pendingFriendRequest);
            res.status(200).send(pendingFriendRequest)
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    //toggle_friendship
    async toggle_friendship(req, res){
        try{
            const userId = req.userID;
            console.log("IN Toggle:", req.params.friendId);
            const toggle = await this.friendShipRepository.toggle_friendship(userId, req.params.friendId); 
            console.log(userId, req.params.friendId, "A lo toggle", toggle)
            res.status(201).send(toggle);
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    //responce to request
    async respondToRequest(req, res){
        try{
            console.log("A lo Details",req.userID, req.params.friendId, req.body.status)
            const responce = await this.friendShipRepository.responce_to_request(req.userID, req.params.friendId, req.body.status);
            res.status(201).send(responce)
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500); 
        }
    }
}