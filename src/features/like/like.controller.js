import LikeRepository from "./like.repository.js"
import ApplicationError from "./../../config/mongoose.config.js"

export default class LikeController{

    constructor(){
        this.likeRepository = new LikeRepository()
    }
    //get Like for specific Post or comment [NB- HARE PLZ USE type and Id]
    async getLike(req, res){
        try{
            console.log(req.params.id, req.query.type);
            const likes = await this.likeRepository.get_Like(req.params.id, req.query.type)
            if(likes){
                res.status(201).send(likes)
            }else{
                res.status(404).send("You send Wrong Id")
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500) 
        }
    }

    //user Like or DisLike on Post Or comment
    async toggleLike(req, res){
        try{
            console.log(req.params.id, req.query.type, req.userID)
            if(req.query.type === "Comment"){
                console.log("Supriya")
                const toggle = await this.likeRepository.likeComment(req.params.id, req.query.type, req.userID);
                //console.log(toggle)
                res.status(201).send(toggle.msg);
            }
            if(req.query.type === "Post"){
                const toggle = await this.likeRepository.likePost(req.params.id, req.query.type, req.userID);
                res.status(201).send(toggle.msg);
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("server error! Try later!!", 500)
        }
    }
}