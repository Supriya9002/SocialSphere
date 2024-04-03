import express from 'express'
import UserController from "./user.controller.js"
import jwtAuth from "./../../middleware/jwt.middleware.js"
import uploadAvatar from "./../../middleware/uploadAvatar.middleware.js"

//Express router
const userRouter = express.Router();

//instance
const userController =new UserController();

// All the paths to controller methods.
// User Profile Updates
userRouter.put("/update-details/:userId", jwtAuth, uploadAvatar.single("avatar"), (req, res)=>{ //User Must be send photo 2MB
    console.log("ROMA")
    userController.update_details_by_id(req, res)
})
userRouter.post("/signup", (req, res)=>{
    userController.signup(req,res)
})
userRouter.post("/signin", (req, res)=>{
    userController.signin(req, res)
})
userRouter.get("/logout",jwtAuth, (req, res)=>{ 
    userController.logout(req, res)
})
userRouter.get("/logout-all-devices", jwtAuth, (req, res)=>{
    userController.logout_all_devices(req, res);
})
userRouter.get("/get-details/:userId",jwtAuth, (req, res)=>{
    userController.get_details_byId(req, res) 
})
userRouter.get("/get-all-details",jwtAuth, (req, res)=>{
    userController.get_details_All_User(req, res)
})



export default userRouter;