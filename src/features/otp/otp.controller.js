import OtpRepository from "./otp.repository.js"
import UserRepostory from "./../user/user.repository.js"
import ApplicationError from "./../../error/applicationError.js"


export default class OtpController{

    constructor(){
        this.otpRepository = new OtpRepository()
    }

    async SendOtp(req, res){
        try{
            const userRepostory = new UserRepostory();
            const v_email = await userRepostory.findEmail(req.body.email);
            //console.log(req.body.email);
            console.log("A lo email",v_email);
            if(!v_email){
                res.status(404).send("Please Send Corrected Email")
            }
            console.log("A lo Rohit", req.userID, req.body.email);
            const otpData = await this.otpRepository.generateAndSaveOTP(req.body.email,  v_email._id);
            console.log("A lo Virat", otpData);
            res.status(201).send('OTP sent successfully');
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500);  
        }
    }

    async VerifyOtp_and_resetPassword(req, res){
        try{
            const userRepostory = new UserRepostory();
            const v_email = await userRepostory.findEmail(req.body.email);
            //console.log("A lo email",v_email);
            if(!v_email){
                res.status(404).send("Please Send Corrected Email")
            }
            console.log("A Amit bhai:",req.body.otp, v_email._id, req.body.newPassword)
            const result = await this.otpRepository.verify_and_resetPassword(req.body.otp, v_email._id, req.body.newPassword);
            res.status(201).send(result);
        }catch(err){ 
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    // async resetPassword(req, res){
    //     try{
    //         const userRepostory = new UserRepostory();
    //         const v_email = await userRepostory.findEmail(req.body.email);    
    //         //console.log("A lo email",v_email);
    //         if(!v_email){
    //             res.status(404).send("Please Send Corrected Email")
    //         }
    //         const updateUser = await this.otpRepository.reset(req.body.otp, v_email._id, req.body.newPassword);
    //         res.status(201).send(updateUser)
    //     }catch(err){
    //         console.log(err);
    //         throw new ApplicationError("server error! Try later!!", 500)
    //     }
    // }
}