import UserRepository from "../user/user.repository.js";
import PostRepository from "../post/post.repository.js";

export default class SearchController {
    constructor() {
        this.userRepository = new UserRepository();
        this.postRepository = new PostRepository();
    }

    async globalSearch(req, res) {
        try {
            const { search } = req.query;
            if (!search) {
                return res.status(400).send("Search query is required");
            }

            // Parallel execution
            const [users, posts] = await Promise.all([
                this.userRepository.getDetails_All_User({ search }),
                this.postRepository.get_AllPost({ search })
            ]);

            res.status(200).send({ users, posts });
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }
}