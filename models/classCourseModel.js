import db from "../db.js";

// Create a new class-course relationship
export const createClassCourse = async (req, res) => {
  const { idClass, idCourse } = req.body;
  const query = "INSERT INTO classCourse (idClass, idCourse) VALUES (?, ?)";
  try {
    const [result] = await db.promise().query(query, [idClass, idCourse]);
    res.status(201).json({
      status: 201,
      message: "Class-course relationship created successfully",
      data: { id: result.insertId },
    });
  } catch (err) {
    console.error("Error creating class-course relationship:", err);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// Retrieve all class-course relationships
export const getClassCourses = async (req, res) => {
  const query = "SELECT * FROM classCourse";
  try {
    const [rows] = await db.promise().query(query);
    res.status(200).json({ status: 200, data: rows });
  } catch (err) {
    console.error("Error retrieving class-course relationships:", err);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// Retrieve a single class-course relationship by idClass and idCourse
export const getClassCourseById = async (req, res) => {
  const { idClass, idCourse } = req.params;
  const query = "SELECT * FROM classCourse WHERE idClass = ? AND idCourse = ?";
  try {
    const [rows] = await db.promise().query(query, [idClass, idCourse]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Class-course relationship not found" });
    }
    res.status(200).json({ status: 200, data: rows[0] });
  } catch (err) {
    console.error("Error retrieving class-course relationship:", err);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// Delete a class-course relationship (mark as inactive)
export const deleteClassCourse = async (req, res) => {
  const { idClass, idCourse } = req.params;
  const query = "DELETE FROM classCourse WHERE idClass = ? AND idCourse = ?";
  try {
    const [result] = await db.promise().query(query, [idClass, idCourse]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Class-course relationship not found" });
    }
    res.status(200).json({
      status: 200,
      message: "Class-course relationship deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting class-course relationship:", err);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};
