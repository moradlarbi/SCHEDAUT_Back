import db from "../db.js";

export const getAllUsers = (req, res) => {
  const query = "SELECT * FROM users WHERE active = 1";
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
  const { first_name, last_name, email, password, role, idClass } = req.body;
  console.log(req.body);

  // Validate required fields
  if (!first_name || !last_name || !email || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  let query;
  let values;

  // Construct query and values based on role
  if (role === "student") {
    if (!idClass) {
      return res
        .status(400)
        .json({ status: 400, message: "idClass is required for students" });
    }
    query =
      "INSERT INTO users (first_name, last_name, email, password, role, idClass) VALUES (?, ?, ?, ?, ?, ?)";
    values = [first_name, last_name, email, password, role, idClass];
  } else {
    query =
      "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)";
    values = [first_name, last_name, email, password, role || "student"];
  }

  // Execute the query
  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error creating user:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    res.status(201).json({
      status: 201,
      message: "User created successfully",
      data: {
        id: results.insertId,
        first_name,
        last_name,
        email,
        role,
        ...(role === "student" && { idClass }), // Include idClass only if the user is a student
      },
    });
  });
};

export const getUserById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT users.*, 
           class.id AS idClass, 
           class.name AS className, 
           class.nb_stud AS classNb_stud
    FROM users
    LEFT JOIN class ON users.idClass = class.id
    WHERE users.id = ? AND users.active = 1
  `;

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

    const user = results[0];
    const responseData = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      role: user.role,
      active: user.active,
    };

    if (user.role === "student") {
      responseData.class = {
        idClass: user.idClass || null,
        className: user.className || null,
        classNb_stud: user.classNb_stud || null,
      };
    }

    res.status(200).json({
      status: 200,
      message: "OK",
      data: responseData,
    });
  });
};

export const findById = (id, callback) => {
  const query = "SELECT * FROM users WHERE id = ? AND active = 1";
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
  const query = "UPDATE users SET active = false WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error marking user as inactive:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    res
      .status(200)
      .json({ status: 200, message: "User marked as inactive successfully" });
  });
};
