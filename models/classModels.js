import db from "../db.js";
// Create a new class
export const createClass = (name, nb_stud,active) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO class (name, nb_stud,active) VALUES (?, ?,?)";
    db.query(query, [name, nb_stud,active], (err, results) => {
      if (err) {
        console.error("Error creating class:", err);
        reject(err);
      } else {
        resolve({ id: results.insertId, name, nb_stud });
      }
    });
  });
};
export const insertClassCourses = async (classCourseData) => {
  const query =
    "INSERT INTO classCourse (idClass, idCourse, idTeacher) VALUES ?";
  return new Promise((resolve, reject) => {
    db.query(query, [classCourseData], (err, results) => {
      if (err) {
        console.error("Error inserting classCourse data:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Get all classes
export const getClasses = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM class";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error retrieving classes:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
export const getClassCourseTeachers = (classId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT idCourse, idTeacher FROM classCourse WHERE idClass = ?"
    db.query(query,[classId], (err, results) => {
      if (err) {
        console.error("Error retrieving classes:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}
export const addCourseTeacherRelationship = (classId, idCourse, idTeacher) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO classCourse (idClass, idCourse, idTeacher) VALUES (?, ?, ?)"
    db.query(query,[classId, idCourse, idTeacher], (err, results) => {
      if (err) {
        console.error("Error retrieving classes:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}
export const deleteCourseTeacherRelationship = (classId, idCourse, idTeacher) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM classCourse WHERE idClass = ? AND idCourse = ? AND idTeacher = ?"
    db.query(query,[classId, idCourse, idTeacher], (err, results) => {
      if (err) {
        console.error("Error retrieving classes:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}


// Get class by ID
export const getClassById = (id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM class WHERE id = ? AND active = 1";
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error retrieving class:", err);
        reject(err);
      } else if (results.length === 0) {
        reject(new Error("Class not found"));
      } else {
        resolve(results[0]);
      }
    });
  });
};

// Update a class
export const updateClass = (id, name, nb_stud,active) => {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE class SET name = COALESCE(?, name), nb_stud = COALESCE(?, nb_stud),active=? WHERE id = ?";
    db.query(query, [name, nb_stud,active, id], (err, results) => {
      if (err) {
        console.error("Error updating class:", err);
        reject(err);
      } else if (results.affectedRows === 0) {
        reject(new Error("Class not found"));
      } else {
        resolve({ id, name, nb_stud });
      }
    });
  });
};

// Soft delete a class
export const deleteClass = (id) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE class SET active = 0 WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error deleting class:", err);
        reject(err);
      } else if (results.affectedRows === 0) {
        reject(new Error("Class not found"));
      } else {
        resolve(true);
      }
    });
  });
};
