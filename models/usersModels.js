import db from "../db.js";

export const getAllUsers = (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    res.status(200).json({ status: 200, message: "OK", data: results });
  });
};

// Create a new user
export const createUserController = (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;
  console.log(req.body);
  if (!first_name || !last_name || !email || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  const query =
    "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [first_name, last_name, email, password, role || "student"],
    (err, results) => {
      if (err) {
        console.error("Error creating user:", err);
        return res
          .status(500)
          .json({ status: 500, message: "Internal Server Error" });
      }
      res.status(201).json({
        status: 201,
        message: "User created successfully",
        data: { id: results.insertId, first_name, last_name, email, role },
      });
    }
  );
};

export const getUserById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user by ID:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    res.status(200).json({ status: 200, message: "OK", data: results[0] });
  });
};

export const findById = (id, callback) => {
  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [id], callback);
};

export const create = (userData, callback) => {
  const { first_name, last_name, role = "student", email, password } = userData;
  const query = `
      INSERT INTO users (first_name, last_name, role, email, password)
      VALUES (?, ?, ?, ?, ?)
    `;
  db.query(query, [first_name, last_name, role, email, password], callback);
};

export const updateUser = (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, password, role } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  const query =
    "UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ?, role = ? WHERE id = ?";
  db.query(
    query,
    [first_name, last_name, email, password, role, id],
    (err, results) => {
      if (err) {
        console.error("Error updating user:", err);
        return res
          .status(500)
          .json({ status: 500, message: "Internal Server Error" });
      }
      res
        .status(200)
        .json({ status: 200, message: "User updated successfully" });
    }
  );
};

export const deleteUserController = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    res.status(200).json({ status: 200, message: "User deleted successfully" });
  });
};
