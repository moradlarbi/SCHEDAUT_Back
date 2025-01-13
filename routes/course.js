import express from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getActiveCourses
} from "../models/courseModels.js";
import isUserMidd from "../middlewares/authentification.js"
const router = express.Router();

// Routes
router.get("/active",isUserMidd,getActiveCourses);
router.get("/", isUserMidd,getAllCourses); // Fetch all courses
router.get("/:id",isUserMidd, getCourseById); // Fetch a course by ID
router.post("/",isUserMidd, createCourse); // Create a new course
router.put("/:id",isUserMidd, updateCourse); // Update a course by ID
router.delete("/:id",isUserMidd, deleteCourse); // Delete a course by ID


export default router;
