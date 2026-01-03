import UserRepostory from "./user.repository.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class UserController {
  constructor() {
    this.userRepostory = new UserRepostory();
  }

  //Register
  async signup(req, res) {
    try {
      req.body.password = await bcrypt.hash(req.body.password, 12);
      const user = await this.userRepostory.signup(req.body);
      res.status(201).send(user);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }

  //Login
  async signin(req, res) {
    try {
      const user = await this.userRepostory.findEmail(req.body.email);
      //console.log("A durling", user);
      if (!user) {
        return res.status(404).send("Email Invalid");
      }
      const userPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (userPassword) {
        const accessToken = jwt.sign(
          {
            userID: user._id,
          },
          process.env.Access_Token_JWT_SECRET,
          {
            expiresIn: Access_Token_ExpiresIn,
          }
        );

        const refreshToken = jwt.sign(
          {
            userID: user._id,
          },
          process.env.Refresh_Token_JWT_SECRET,
          {
            expiresIn: Refresh_Token_ExpiresIn,
          }
        );

        // Add the generated refresh token to the user's sessions array
        user.sessions.push(refreshToken);
        await user.save();

        // Send refresh token in cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          // secure: true, // Uncomment this in production (requires HTTPS)
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).send({
          accessToken,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            avatar: user.avatar,
          },
        });
      } else {
        res.status(404).send("Password Not Correct");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }

  // Refresh Access Token
  async refreshAccessToken(req, res) {
    // Read from cookie first, fallback to body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const user = await this.userRepostory.findUserWithToken(
        decoded.userID,
        refreshToken
      );

      if (!user) {
        return res.status(401).send("Invalid refresh token.");
      }

      const accessToken = jwt.sign(
        { userID: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ accessToken });
    } catch (error) {
      console.log(error);
      return res.status(400).send("Invalid refresh token.");
    }
  }

  //Logout One device
  async logout(req, res) {
    try {
      // For stateless access tokens, we need the refresh token to identify the session to revoke.
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      // Fallback: If no refresh token provided, we can't remove a specific session if we don't store access tokens.
      // But if the client sends the refresh token, we remove it.

      if (!refreshToken) {
        return res.status(400).send("Refresh token is required for logout");
      }

      const result = await this.userRepostory.logout(req.userID, refreshToken);

      // Clear the cookie
      res.clearCookie("refreshToken");

      if (result == null) {
        return res
          .status(400)
          .send("User already logged out or token not found");
      }
      res.status(200).send("logout successful");
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }

  //Logout All devices
  async logout_all_devices(req, res) {
    try {
      const token = req.headers["authorization"];
      //console.log("A LO token in LOGOUT ", token, req.userID)
      const result = await this.userRepostory.logoutAllDevice(
        req.userID,
        token
      );
      if (result == null) {
        return res.status(400).send("User already logged out");
      }
      res.status(400).send("All Device logout successful");
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }

  //get-details by id
  async get_details_byId(req, res) {
    try {
      const users_details = await this.userRepostory.getDetails_byId(
        req.params.userId
      );
      console.log(users_details);
      if (users_details) {
        res.status(201).send(users_details);
      } else {
        res.status(404).send("UserId Not Found");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }

  //get-details all user
  async get_details_All_User(req, res) {
    try {
      const { page, limit, search, sort, gender } = req.query;
      const users_details = await this.userRepostory.getDetails_All_User({
        page,
        limit,
        search,
        sort,
        gender,
      });
      // console.log(users_details);
      res.status(200).send(users_details);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }

  //update-details by-Id
  async update_details_by_id(req, res) {
    try {
      console.log("Supriya");
      console.log(req.body);
      console.log(req.file?.filename);

      const userId = req.params.userId;
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send("Invalid or missing userId parameter");
      }

      //if user want password changes
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 12);
      }

      const updateData = req.body;
      //if user upload Avatar Uploads for user profile
      if (req.file.filename && req.body) {
        updateData.avatar = req.file.filename;
      }
      const update = await this.userRepostory.update_details(
        userId,
        updateData
      );
      if (update) {
        res.status(201).send(update);
      } else {
        res.status(404).send("User id not found");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }
}
