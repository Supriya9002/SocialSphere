import mongoose from "mongoose";
import OtpSchema from "./otp.schema.js"
import ApplicationError from "./../../error/applicationError.js"
import {v4 as uuidv4} from "uuid"
import userSchema from "./../user/user.schema.js"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"

//model
const OtpModel = mongoose.model("otp", OtpSchema);
const UserModel = mongoose.model("user", userSchema);

export default class OtpRepository{

    //send otp in email use nodemailer
    async sendOtpEmail(email, otp) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'haldarsupriya22@gmail.com', // replace with your email
                    pass: 'eoss jtxx ebzh ctud' // replace with your password or app-specific password
                }
            });
            //console.log("transporter: ",transporter)

            const mailOptions = {
                from: 'haldarsupriya22@gmail.com',
                to: email,
                subject: 'Your OTP Code',
                text: `${otp} is your One time OTP (Valid Only 15 minit) to Reset-Password to Social Media APP. Don't share OTP with anyone. \nPlease enter the OTP to proceed.`
            };

            await transporter.sendMail(mailOptions);   
            return;
        } catch (err) {
            console.error(err);
            throw new ApplicationError("Error sending OTP email", 500);
        }
    }

    // save otp in schema
    async generateAndSaveOTP(userEmail, userID){
        try{
            const Otp = uuidv4().substring(0, 6) //Generate a 6-digit OTP
            console.log(Otp);
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 15) //Set OTP expiration to 15 minutes

            const otpData =new OtpModel({userId: userID, otp: Otp, expiresAt: expiresAt}); 
            await otpData.save();
            await this.sendOtpEmail(userEmail, Otp);
            return otpData;
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    // verify otp
    async verify_and_resetPassword(otp, userID, newPassword){
        try{
            const result = await OtpModel.findOne(
                {
                    userId: userID, 
                    otp: otp, 
                    expiresAt: { $gt: new Date()} //greater than the current date and less than or equal to 15 minutes ago
                }
            ); //, $lte: new Date(new Date() - 15 * 60 * 1000)
            console.log("Verify result: ",result)
            if(result){
                console.log("A Soumay Vai: ",result.otp, result.userId, newPassword)
                // Changes The user Password
                if(newPassword == null){
                    return "OTP Verifed but Password Not changed"
                }else{
                    newPassword = await bcrypt.hash(newPassword, 12);
                    console.log("A lo newPass",newPassword);
                    const user = await UserModel.findOneAndUpdate(
                        {_id: userID},
                        {password: newPassword}
                    ).select({password: 0, date: 0, sessions: 0, _id: 0, __v: 0});
                    //console.log(user);
                    return user;
                }
            }else{
                return "OTP Wrong"
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }

    // // reset password
    // async reset(otp, userID, newPassword){
    //     try{

    //         const v = await this.verify(otp, userID);

    //         if(v != "OTP Verifed"){
    //             throw new ApplicationError("You send Wrong Otp", 404);
    //         }
    //         newPassword = await bcrypt.hash(newPassword, 12);
    //         //console.log("A lo newPass",newPassword);
    //         const result = await UserModel.findOneAndUpdate(
    //             {_id: userID},
    //             {password: newPassword}
    //         )
    //         //console.log(result);
    //         return result;
    //     }catch(err){
    //         console.log(err);
    //         throw new ApplicationError("server error! Try later!!", 500)
    //     }
    // }
}