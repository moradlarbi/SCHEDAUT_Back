import db from "../db.js";

// Fetch all courses
export const getAllCourses = (req, res) => {
  const query = "SELECT * FROM course";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching courses:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    res.status(200).json({ status: 200, message: "OK", data: results });
  });
};

// Fetch a course by ID
export const getCourseById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM course WHERE id = ? AND active = 1";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching course by ID:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ status: 404, message: "Course not found" });
    }
    res.status(200).json({ status: 200, message: "OK", data: results[0] });
  });
};

// Create a new course
export const createCourse = (req, res) => {
  const { name, nb_hour,active } = req.body;
  console.log(req.body)
  if (!name || nb_hour === undefined) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  const query = "INSERT INTO course (name, nb_hour,active) VALUES (?, ?, ?)";
  db.query(query, [name, nb_hour,active], (err, results) => {
    if (err) {
      console.error("Error creating course:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    res.status(201).json({
      status: 201,
      message: "Course created successfully",
      data: { id: results.insertId, name, nb_hour,active },
    });
  });
};

// Update a course by ID
export const updateCourse = (req, res) => {
  const { id } = req.params;
  const { name, nb_hour,active } = req.body;

  if (!name || nb_hour === undefined) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  const query = "UPDATE course SET name = ?, nb_hour = ?, active= ? WHERE id = ?";
  db.query(query, [name, nb_hour,active, id], (err, results) => {
    if (err) {
      console.error("Error updating course:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    res
      .status(200)
      .json({ status: 200, message: "Course updated successfully" });
  });
};

// Delete a course by ID
export const deleteCourse = (req, res) => {
  const { id } = req.params;
  const query = "UPDATE course SET active = false WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error updating course:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ status: 404, message: "Course not found" });
    }

    res
      .status(200)
      .json({ status: 200, message: "Course marked as inactive successfully" });
  });
};
