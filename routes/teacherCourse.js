import express from "express";
import {
  getAllTeacherCourses,
  getTeacherCourseById,
  createTeacherCourse,
  deleteTeacherCourse,
} from "../models/teacherCourseModels.js";

const router = express.Router();

// Get all teacherCourse entries
router.get("/", async (req, res) => {
  try {
    const teacherCourses = await getAllTeacherCourses();
    res.status(200).json({ status: 200, data: teacherCourses });
  } catch (error) {
    console.error("Error fetching teacher courses:", error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
});

// Get a teacherCourse by teacher and course ID
router.get("/:idTeacher/:idCourse", async (req, res) => {
  const { idTeacher, idCourse } = req.params;
  try {
    const teacherCourse = await getTeacherCourseById(idTeacher, idCourse);
    if (!teacherCourse) {
      return res.status(404).json({ status: 404, message: "Not found" });
    }
    res.status(200).json({ status: 200, data: teacherCourse });
  } catch (error) {
    console.error("Error fetching teacher course:", error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
});

router.post("/", createTeacherCourse); // Create a new salle

// Delete a teacherCourse
router.delete("/:idTeacher/:idCourse", async (req, res) => {
  const { idTeacher, idCourse } = req.params;
  try {
    await deleteTeacherCourse(idTeacher, idCourse);
    res.status(200).json({ status: 200, message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting teacher course:", error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
});

export default router;
