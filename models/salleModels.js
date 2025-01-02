import db from "../db.js";

// Fetch all salles
export const getAllSalles = (req, res) => {
  const query = "SELECT * FROM classRoom";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching salles:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    res.status(200).json({ status: 200, message: "OK", data: results });
  });
};

// Fetch a salle by ID
export const getSalleById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM classRoom WHERE id = ? AND active = 1";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching salle by ID:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ status: 404, message: "Salle not found" });
    }
    res.status(200).json({ status: 200, message: "OK", data: results[0] });
  });
};

// Create a new salle
export const createSalle = (req, res) => {
  const { name, capacity,active } = req.body;

  if (!name || capacity === undefined) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  const query = "INSERT INTO classRoom (name, capacity,active) VALUES (?, ?, ?)";
  db.query(query, [name, capacity,active], (err, results) => {
    if (err) {
      console.error("Error creating salle:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    res.status(201).json({
      status: 201,
      message: "Salle created successfully",
      data: { id: results.insertId, name, capacity },
    });
  });
};

// Update a salle by ID
export const updateSalle = (req, res) => {
  const { id } = req.params;
  const { name, capacity,active } = req.body;

  if (!name || capacity === undefined) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  const query = "UPDATE classRoom SET name = ?, capacity = ?, active=? WHERE id = ?";
  db.query(query, [name, capacity,active, id], (err, results) => {
    if (err) {
      console.error("Error updating salle:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    res
      .status(200)
      .json({ status: 200, message: "Salle updated successfully" });
  });
};

// Delete a salle by ID
export const deleteSalle = (req, res) => {
  const { id } = req.params;
  const query = "UPDATE classRoom SET active = false WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error updating salle:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ status: 404, message: "Salle not found" });
    }

    res
      .status(200)
      .json({ status: 200, message: "Salle marked as inactive successfully" });
  });
};
