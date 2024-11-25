import express from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../models/courseModels.js";

const router = express.Router();

// Routes
router.get("/", getAllCourses); // Fetch all courses
router.get("/:id", getCourseById); // Fetch a course by ID
router.post("/", createCourse); // Create a new course
router.put("/:id", updateCourse); // Update a course by ID
router.delete("/:id", deleteCourse); // Delete a course by ID

export default router;
