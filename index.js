import "./env.js";
import bodyParser from "body-parser";
import express from "express";
import userRouter from "./src/features/user/user.routes.js";
import connectUsingMongoose from "./src/config/mongoose.config.js";
import ApplicationError from "./src/error/applicationError.js";
import postRouter from "./src/features/post/post.routes.js";
import jwtAuth from "./src/middleware/jwt.middleware.js";
import path from "path";
import commentRouter from "./src/features/comment/comment.routes.js";
import likeRouter from "./src/features/like/like.routes.js";
import friendshipRouter from "./src/features/friendship/friendship.routes.js";
import OtpRouter from "./src/features/otp/otp.routes.js";
import searchRouter from "./src/features/search/search.routes.js";
import loggerMiddleware from "./src/middleware/logger.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";

//server
const server = express();

//all middleware
// enable CORS early so preflight requests get handled
server.use(cors({ origin: "http://localhost:3000", credentials: true }));
server.options("*", cors());

// all middleware
server.use(bodyParser.json());
server.use(cookieParser());
server.use(express.static(path.resolve("public")));
server.use(loggerMiddleware);

// for all requests related to App
server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);
server.use("/api/comments", commentRouter);
server.use("/api/likes", likeRouter);
server.use("/api/friends", friendshipRouter);
server.use("/api/otp", OtpRouter);
server.use("/api/search", searchRouter);

//all API
server.get("/", (req, res) => {
  res.send("WELCOME to Social Media App");
});

//Application Error Handler
server.use((err, req, res, next) => {
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode || 500).json({
      error: err.message,
      statusCode: err.statusCode || 500,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }
  const status = err.statusCode || 500;
  const payload = {
    error: err?.message || "server error! Try later!!",
    statusCode: status,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    code: err?.code || err?.Code || err?.name,
    bucket: err?.Bucket,
    endpoint: err?.Endpoint,
    requestId: err?.RequestId || err?.$metadata?.requestId,
  };
  return res.status(status).json(payload);
});

//port
server.listen(8000, async () => {
  await connectUsingMongoose();
  console.log("Server Listen on 8000");
});
