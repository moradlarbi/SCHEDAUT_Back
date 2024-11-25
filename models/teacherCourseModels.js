import db from "../db.js";

const createTeacherCourse = (req, res) => {
  const { idTeacher, idCourse } = req.body;

  if (!idTeacher || idCourse === undefined) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  const query = "INSERT INTO teacherCourse (idTeacher, idCourse) VALUES (?, ?)";
  db.query(query, [idTeacher, idCourse], (err, results) => {
    if (err) {
      console.error("Error creating teacher course:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    res.status(201).json({
      status: 201,
      message: "Teacher course created successfully",
      data: { idTeacher, idCourse },
    });
  });
};

// Get all teacherCourse relationships
const getAllTeacherCourses = async () => {
  const query = "SELECT * FROM teacherCourse";
  const [rows] = await db.promise().query(query);
  return rows;
};

// Get a teacherCourse relationship by IDs
const getTeacherCourseById = async (idTeacher, idCourse) => {
  const query =
    "SELECT * FROM teacherCourse WHERE idTeacher = ? AND idCourse = ?";
  const [rows] = await db.promise().query(query, [idTeacher, idCourse]);
  return rows[0];
};

// Delete a teacherCourse relationship by IDs
const deleteTeacherCourse = async (idTeacher, idCourse) => {
  const query =
    "DELETE FROM teacherCourse WHERE idTeacher = ? AND idCourse = ?";
  const [result] = await db.promise().query(query, [idTeacher, idCourse]);
  return result.affectedRows > 0;
};

export {
  createTeacherCourse,
  getAllTeacherCourses,
  getTeacherCourseById,
  deleteTeacherCourse,
};
