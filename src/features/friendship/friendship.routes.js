import express from "express";
import FriendShipController from "./friendship.controller.js";
import jwtAuth from "../../middleware/jwt.middleware.js";

const friendshipRouter = express.Router();

//instance
const friendShipController = new FriendShipController();

friendshipRouter.get("/get-friends", jwtAuth, (req, res) => {
  friendShipController.getFriends(req, res);
});
friendshipRouter.get("/get-pending-requests", jwtAuth, (req, res) => {
  friendShipController.pendingRequest(req, res);
});
friendshipRouter.get("/toggle-friendship/:friendId", jwtAuth, (req, res) => {
  friendShipController.toggle_friendship(req, res);
});
friendshipRouter.get("/response-to-request/:friendId", jwtAuth, (req, res) => {
  friendShipController.respondToRequest(req, res);
});

export default friendshipRouter;
