import PostRepository from "./post.repository.js";
import ApplicationError from "./../../error/applicationError.js";
import s3Service from "./../../services/s3.service.js";

export default class PostController {
  constructor() {
    this.postRepository = new PostRepository();
  }

  // Add Post
  async addPost(req, res) {
    try {
      if (!req.file) {
        console.log("No file received in addPost; req.file is undefined");
        return res.status(400).send({
          message:
            'No file uploaded. Ensure form field name is "imageUrl" and request is multipart/form-data.',
        });
      }
      if (req.file.size > 1 * 1024 * 1024) {
        return res.status(413).send("Image must be 1MB or below");
      }
      const uploadResult = await s3Service.uploadFile(req.file, "posts");
      const post = {
        userId: req.userID,
        caption: req.body.caption,
        imageUrl: uploadResult.url,
        imageKey: uploadResult.key,
      };
      const newpost = await this.postRepository.add(post);
      res.status(201).send(newpost);
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        error: err.message || "Internal Server Error",
      });
    }
  }

  // getOne Post by id, all user see, this post
  async getOnePost(req, res) {
    try {
      //console.log(req.params.postId)
      const post = await this.postRepository.getOne(req.params.postId);
      //console.log(post)
      if (!post) {
        res.status(404).send("Post Not Found");
      } else {
        res.status(200).send(post);
      }
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        error: err.message || "Internal Server Error",
      });
    }
  }

  // get all Posts for user Specific
  async getPost(req, res) {
    try {
      const userID = req.userID;
      console.log("A LO Userid", userID);
      const posts = await this.postRepository.getPost(userID);
      if (posts.length === 0) {
        res.status(404).send("You Can not Create Any Post");
      } else {
        res.status(200).send(posts);
      }
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        error: err.message || "Internal Server Error",
      });
    }
  }

  // all Users see each other Post, all post show
  async getAllPost(req, res) {
    try {
      // console.log("Supriya Haldar")
      const { page, limit, search, sort } = req.query;
      const allPost = await this.postRepository.get_AllPost({
        page,
        limit,
        search,
        sort,
      });
      // console.log(allPost);
      res.status(200).send(allPost);
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        error: err.message || "Internal Server Error",
      });
    }
  }

  // delete specific Post by user
  async deletePost(req, res) {
    try {
      const userID = req.userID;
      const post = await this.postRepository.getOne(req.params.postId);
      if (!post || String(post.userId) !== String(userID)) {
        return res.status(404).send("Not found Post");
      }
      if (post.imageKey) {
        await s3Service.deleteFile(post.imageKey);
      }
      const deleteResult = await this.postRepository.delete(
        userID,
        req.params.postId
      );
      if (deleteResult?.deletedCount > 0)
        return res.status(200).send("Post Delete");
      return res.status(404).send("Not found Post");
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        error: err.message || "Internal Server Error",
      });
    }
  }

  // update specific Post by user
  async updatePost(req, res, next) {
    try {
      const userID = req.userID;
      if (req.file) {
        if (req.file.size > 1 * 1024 * 1024) {
          return res.status(413).send("Image must be 1MB or below");
        }
        console.log("postId ..", req.params.postId);
        const existing = await this.postRepository.getOne(req.params.postId);
        console.log("existing ..", existing);
        if (!existing || String(existing.userId) !== String(userID)) {
          return res.status(404).send("Post Not found");
        }
        if (existing.imageKey) {
          await s3Service.deleteFile(existing.imageKey);
        }
        const uploadResult = await s3Service.uploadFile(req.file, "posts");
        req.body.imageUrl = uploadResult.url;
        req.body.imageKey = uploadResult.key;
      }
      const updatePost = await this.postRepository.update(
        userID,
        req.params.postId,
        req.body
      );
      console.log("updatePost", updatePost);
      if (updatePost) {
        res.status(200).send("Post Updated");
      } else {
        res.status(404).send("Post Not found");
      }
    } catch (err) {
      // console.log("err.statusCode", err.statusCode);
      // return res.status(err.statusCode || 500).json({
      //   error: err.message || "Internal Server Error",
      // });
      next(err);
    }
  }
}
