import { Router } from "express";
import {
	createUser,
	deleteUser,
	getAllUsers,
	getUserById,
	updateUser,
} from "../controllers/user.controllers.js";

export const userRoute = Router();

userRoute.post("/users", createUser);
userRoute.get("/users", getAllUsers);
userRoute.put("/users/:id", updateUser);
userRoute.delete("/users/:id", deleteUser);
userRoute.get("/users/:id", getUserById);

export default userRoute;

