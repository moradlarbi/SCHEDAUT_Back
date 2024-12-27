import express from "express";
import {
  createClassCourse,
  getClassCourses,
  getClassCourseById,
  deleteClassCourse,
} from "../models/classCourseModel.js";

const router = express.Router();

router.post("/", createClassCourse); // Create a new class-course relationship
router.get("/", getClassCourses); // Retrieve all class-course relationships
router.get("/:idClass/:idCourse", getClassCourseById); // Retrieve a specific relationship
router.delete("/:idClass/:idCourse", deleteClassCourse); // Delete a specific relationship

export default router;
