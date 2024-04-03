import express from "express"
import OtpController from "./otp.controller.js"

const OtpRouter = express.Router();

//instance
const otpController = new OtpController();

OtpRouter.post("/send", (req, res)=>{
    otpController.SendOtp(req,res)
})
OtpRouter.post("/verify", (req, res)=>{
    otpController.VerifyOtp_and_resetPassword(req, res)
})
// OtpRouter.post("/reset-password", (req, res)=>{
//     otpController.resetPassword(req, res);
// })



export default OtpRouter;