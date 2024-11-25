import db from "../db.js";

export const getAllClasses = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM class";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching classes:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

export const getClassById = (id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM class WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error fetching class by ID:", err);
        return reject(err);
      }
      resolve(results[0] || null);
    });
  });
};

export const createClass = (classData) => {
  return new Promise((resolve, reject) => {
    const { name, nb_stud } = classData;
    const query = "INSERT INTO class (name, nb_stud) VALUES (?, ?)";
    db.query(query, [name, nb_stud], (err, results) => {
      if (err) {
        console.error("Error creating class:", err);
        return reject(err);
      }
      resolve({ id: results.insertId, ...classData });
    });
  });
};

export const updateClass = (id, classData) => {
  return new Promise((resolve, reject) => {
    const { name, nb_stud } = classData;
    const query = "UPDATE class SET name = ?, nb_stud = ? WHERE id = ?";
    db.query(query, [name, nb_stud, id], (err, results) => {
      if (err) {
        console.error("Error updating class:", err);
        return reject(err);
      }
      resolve({ id, ...classData });
    });
  });
};

export const deleteClass = (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM class WHERE id = ?";
    db.query(query, [id], (err) => {
      if (err) {
        console.error("Error deleting class:", err);
        return reject(err);
      }
      resolve();
    });
  });
};
