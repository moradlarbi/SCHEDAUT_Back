import express from "express";
import {
  getAllUsers,
  getUserById,
  createUserController,
  updateUser,
  deleteUserController,
  getTeachers,
} from "../models/usersModels.js";

const router = express.Router();

// Routes
router.get("/teacher", getTeachers)
router.get("/", getAllUsers); // Fetch all users
router.get("/:id", getUserById); // Fetch user by ID
router.post("/", createUserController); // Create new user
router.put("/:id", updateUser); // Update user by ID
router.delete("/:id", deleteUserController); // Delete user by ID

export default router;