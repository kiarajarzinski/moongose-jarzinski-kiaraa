import { Router } from "express";
import {
	createTag,
	deleteTag,
	getAllTags,
	getTagById,
	updateTag,
} from "../controllers/tag.controllers.js";

export const tagRoute = Router();

tagRoute.post("/tags", createTag);
tagRoute.get("/tags", getAllTags);
tagRoute.put("/tags/:id", updateTag);
tagRoute.delete("/tags/:id", deleteTag);
tagRoute.get("/tags/:id", getTagById);

export default tagRoute;

