import UserRepostory from "./user.repository.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export default class UserController{

    constructor(){
        this.userRepostory = new UserRepostory();
    }

    //Register
    async signup(req, res){
        try{
            req.body.password = await bcrypt.hash(req.body.password, 12);
            const user = await this.userRepostory.signup(req.body);
            res.status(201).send(user);
        }catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }

    //Login
    async signin(req, res){
        try{
            const user = await this.userRepostory.findEmail(req.body.email);
            //console.log("A durling", user);
            if(!user){
                res.status(404).send("Email Invalid");
            }
            const userPassword = await bcrypt.compare(req.body.password, user.password);
            if(userPassword){
                const token = jwt.sign(
                    {
                        userID: user._id, //hare set user(_id), it uses in jwt.middleware.js
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1h"
                    }
                )
                // Add the generated token to the user's sessions array
                user.sessions.push(token);
                await user.save();
                //console.log("A durling", user);
                res.status(201).send(token)
            }else{
                res.status(404).send("Password Not Correct");
            }
        }catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }

    //Logout One device
    async logout(req, res){
        try{
            const token = req.headers['authorization'];
            console.log("A LO token in LOGOUT ", token, req.userID)
            const result = await this.userRepostory.logout(req.userID, token);
            if (result == null) {
                return res.status(400).send("User already logged out");
            }
            res.status(400).send("logout successful")
        }catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");   
        }
    }

    //Logout All devices   
    async logout_all_devices(req, res){  
        try{
            const token = req.headers['authorization'];
            //console.log("A LO token in LOGOUT ", token, req.userID)
            const result = await this.userRepostory.logoutAllDevice(req.userID, token);
            if (result == null) {
                return res.status(400).send("User already logged out");
            }
            res.status(400).send("All Device logout successful")
        }catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }
    
    //get-details by id
    async get_details_byId(req, res){
        try{
            const users_details = await this.userRepostory.getDetails_byId(req.params.userId);
            console.log(users_details);
            if(users_details){
                res.status(201).send(users_details)
            }
            else{
                res.status(404).send("UserId Not Found");
            }
        }catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }

    //get-details all user
    async get_details_All_User(req, res){
        try{
            const users_details = await this.userRepostory.getDetails_All_User();
            console.log(users_details);
            res.status(201).send(users_details)
        }catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }

    //update-details by-Id
    async update_details_by_id(req, res){
        try{
            console.log("Supriya")
            console.log(req.body);
            console.log(req.file.filename);
            

            //if user want password changes
            if(req.body.password){
                req.body.password = await bcrypt.hash(req.body.password, 12);
            }
            
            const updateData = req.body;
            //if user upload Avatar Uploads for user profile
            if(req.file.filename && req.body){
                updateData.avatar = req.file.filename;
            }
            const update = await this.userRepostory.update_details(req.params.userId, updateData);
            if(update){
                res.status(201).send(update)
            }else{
                res.status(404).send("User id not found") 
            }
            
        }catch(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }
}
