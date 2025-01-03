import express from "express";
import db from "../db.js"
import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  insertClassCourses,
  getClassCourseTeachers,
  addCourseTeacherRelationship,
  deleteCourseTeacherRelationship
} from "../models/classModels.js";

const router = express.Router();

// Create a new class
router.post("/", async (req, res) => {
  const { name, nb_stud, active, courseTeachers } = req.body;

  if (!name || !nb_stud || !Array.isArray(courseTeachers)) {
    return res.status(400).json({
      status: 400,
      message: "Missing required fields or invalid data",
    });
  }

  try {
    // Create the class
    const newClass = await createClass(name, nb_stud, active);
    const idClass = newClass.id; // Assuming `createClass` returns the `id` of the new class

    if (courseTeachers.length > 0) {
      // Prepare the data for `classCourse` insertion
      const classCourseData = courseTeachers.map((item) => [
        idClass,
        item.idCourse,
        item.idTeacher,
      ]);

      console.log("Prepared classCourse data:", classCourseData);

      // Insert `classCourse` relationships
      const insertionResult = await insertClassCourses(classCourseData);

      console.log("Inserted classCourse relationships:", insertionResult);
    }

    res.status(201).json({
      status: 201,
      message: "Class and course-teacher relationships created successfully",
      data: newClass,
    });
  } catch (error) {
    console.error("Error creating class or relationships:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


// Get all classes
router.get("/", async (req, res) => {
  const query = `
    SELECT 
        c.id AS classId,
        c.name AS className,
        c.nb_stud AS numberOfStudents,
        c.active AS isActive,
        cc.idCourse,
        cc.idTeacher
    FROM 
        class c
    LEFT JOIN 
        classCourse cc ON c.id = cc.idClass;
  `;

  try {
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching class data:", err);
        return res.status(500).json({
          status: 500,
          message: "Internal Server Error",
          error: err.message,
        });
      }

      // Transform the results into the desired structure
      const classes = results.reduce((acc, row) => {
        let classEntry = acc.find((c) => c.id === row.classId);

        if (!classEntry) {
          classEntry = {
            id: row.classId,
            name: row.className,
            nb_stud: row.numberOfStudents,
            active: row.isActive,
            courseTeachers: [],
          };
          acc.push(classEntry);
        }

        // Check if the courseTeacher already exists before adding
        if (
          row.idCourse &&
          row.idTeacher &&
          !classEntry.courseTeachers.some(
            (ct) =>
              ct.idCourse === row.idCourse && ct.idTeacher === row.idTeacher
          )
        ) {
          classEntry.courseTeachers.push({
            idCourse: row.idCourse,
            idTeacher: row.idTeacher,
          });
        }

        return acc;
      }, []);

      res.status(200).json({
        status: 200,
        message: "Classes retrieved successfully",
        data: classes,
      });
    });
  } catch (error) {
    console.error("Error in GET /classes:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});



// Get class by ID
router.get("/:id", async (req, res) => {

  const { id } = req.params;
  try {
    const classData = await getClassById(id);
    res.status(200).json({ status: 200, data: classData });
  } catch (error) {
    res.status(error.message === "Class not found" ? 404 : 500).json({
      status: error.message === "Class not found" ? 404 : 500,
      message: error.message,
    });
  }
});

// Update a class
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, nb_stud, active, courseTeachers } = req.body;

  if (!name && !nb_stud && !courseTeachers) {
    return res
      .status(400)
      .json({ status: 400, message: "No fields to update provided" });
  }

  try {
    const updatedClass = await updateClass(id, name, nb_stud, active);

    if (courseTeachers && Array.isArray(courseTeachers)) {
      const existingCourseTeachers = await getClassCourseTeachers(id);

      const newRelationships = courseTeachers.filter(
        (newCT) =>
          !existingCourseTeachers.some(
            (existingCT) =>
              existingCT.idCourse === newCT.idCourse &&
              existingCT.idTeacher === newCT.idTeacher
          )
      );

      const relationshipsToDelete = existingCourseTeachers.filter(
        (existingCT) =>
          !courseTeachers.some(
            (newCT) =>
              existingCT.idCourse === newCT.idCourse &&
              existingCT.idTeacher === newCT.idTeacher
          )
      );

      for (const rel of newRelationships) {
        await addCourseTeacherRelationship(id, rel.idCourse, rel.idTeacher);
      }

      for (const rel of relationshipsToDelete) {
        await deleteCourseTeacherRelationship(id, rel.idCourse, rel.idTeacher);
      }
    }

    const updatedCourseTeachers = await getClassCourseTeachers(id);

    res.status(200).json({
      status: 200,
      message: "Class updated successfully",
      data: {
        class: updatedClass,
        courseTeachers: updatedCourseTeachers,
      },
    });
  } catch (error) {
    res.status(error.message === "Class not found" ? 404 : 500).json({
      status: error.message === "Class not found" ? 404 : 500,
      message: error.message,
    });
  }
});


// Soft delete a class
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteClass(id);
    res
      .status(200)
      .json({ status: 200, message: "Class deleted successfully" });
  } catch (error) {
    res.status(error.message === "Class not found" ? 404 : 500).json({
      status: error.message === "Class not found" ? 404 : 500,
      message: error.message,
    });
  }
});

export default router;
