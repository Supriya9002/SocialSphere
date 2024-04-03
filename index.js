import "./env.js"
import bodyParser from "body-parser";
import express from "express";
import userRouter from "./src/features/user/user.routes.js"
import connectUsingMongoose from "./src/config/mongoose.config.js"
import ApplicationError from "./src/error/applicationError.js"
import postRouter from "./src/features/post/post.routes.js"
import jwtAuth from "./src/middleware/jwt.middleware.js"
import path from "path";
import commentRouter from "./src/features/comment/comment.routes.js"
import likeRouter from "./src/features/like/like.routes.js"
import friendshipRouter from "./src/features/friendship/friendship.routes.js"
import OtpRouter from "./src/features/otp/otp.routes.js"
import loggerMiddleware from "./src/middleware/logger.middleware.js"


//server
const server = express();

//all middleware
server.use(bodyParser.json());
server.use(express.static(path.resolve("public")));
server.use(loggerMiddleware)

// for all requests related to App
server.use("/api/users",userRouter)
server.use("/api/posts",jwtAuth, postRouter)
server.use("/api/comments",jwtAuth ,commentRouter)
server.use("/api/likes", jwtAuth, likeRouter)
server.use("/api/friends", jwtAuth, friendshipRouter)
server.use("/api/otp",jwtAuth, OtpRouter)

//all API
server.get("/", (req, res)=>{
    res.send("WELCOME to Social Media App");
})

//Application Error Handler
server.use((err, req, res, next)=>{
    if(err instanceof ApplicationError){
        res.status(err.statusCode).send(err.message)
    }
    res.status(500).send("server error! Try later!!") 
    next();
})

//port
server.listen(8000, ()=>{
    connectUsingMongoose();
    console.log("Server Listen on 8000");
})   