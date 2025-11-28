import { Router } from "express";
import {
	createPost,
	deletePost,
	getAllPosts,
	getPostById,
	updatePost,
	addTagToPost,
} from "../controllers/post.controllers.js";

export const postRoute = Router();

postRoute.post("/posts", createPost);
postRoute.get("/posts", getAllPosts);
postRoute.put("/posts/:id", updatePost);
postRoute.delete("/posts/:id", deletePost);
postRoute.get("/posts/:id", getPostById);

// uno a muchos
postRoute.post("/posts/:id/tags", addTagToPost);

export default postRoute;

