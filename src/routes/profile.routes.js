import { Router } from "express";
import {
	getProfile,
	updateProfile,
	deleteProfile,
} from "../controllers/user.controller.js"; // profile esta embebido en user 

export const profileRoute = Router();

profileRoute.get("/profiles/:userId", getProfile);
profileRoute.put("/profiles/:userId", updateProfile);
profileRoute.delete("/profiles/:userId", deleteProfile);

export default profileRoute;

