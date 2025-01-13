import express from "express";
import {
  getAllUsers,
  getUserById,
  createUserController,
  updateUser,
  deleteUserController,
  getTeachers,
} from "../models/usersModels.js";
import isUserMidd from "../middlewares/authentification.js"
const router = express.Router();

// Routes
router.get("/teacher",isUserMidd, getTeachers)
router.get("/",isUserMidd, getAllUsers); // Fetch all users
router.get("/:id",isUserMidd, getUserById); // Fetch user by ID
router.post("/",isUserMidd, createUserController); // Create new user
router.put("/:id",isUserMidd, updateUser); // Update user by ID
router.delete("/:id",isUserMidd, deleteUserController); // Delete user by ID

export default router;