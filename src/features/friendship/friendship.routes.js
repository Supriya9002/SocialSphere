import express from "express"
import FriendShipController from "./friendship.controller.js"

const friendshipRouter = express.Router();

//instance
const friendShipController = new FriendShipController();

friendshipRouter.get("/get-friends/:userId", (req, res)=>{
    friendShipController.getFriends(req, res);
})
friendshipRouter.get("/get-pending-requests", (req, res)=>{
    friendShipController.pendingRequest(req, res);
})
friendshipRouter.get("/toggle-friendship/:friendId", (req, res)=>{
    friendShipController.toggle_friendship(req, res);
})
friendshipRouter.get("/response-to-request/:friendId", (req, res)=>{
    friendShipController.respondToRequest(req, res);
})


export default friendshipRouter;