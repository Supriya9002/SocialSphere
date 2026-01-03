import express from 'express';
import SearchController from './search.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';

const searchRouter = express.Router();
const searchController = new SearchController();

searchRouter.get("/", jwtAuth, (req, res) => {
    searchController.globalSearch(req, res);
});

export default searchRouter;