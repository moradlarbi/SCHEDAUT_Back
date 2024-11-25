import db from "../db.js";

// Fetch all events
export const getAllEvents = (req, res) => {
  const query = "SELECT * FROM event";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching events:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    res.status(200).json({ status: 200, message: "OK", data: results });
  });
};

// Fetch an event by startTime and endTime
export const getEventById = (req, res) => {
  const { startTime, endTime } = req.params;
  const query = "SELECT * FROM event WHERE startTime = ? AND endTime = ?";
  db.query(query, [startTime, endTime], (err, results) => {
    if (err) {
      console.error("Error fetching event:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ status: 404, message: "Event not found" });
    }
    res.status(200).json({ status: 200, message: "OK", data: results[0] });
  });
};

// Create a new event
export const createEvent = (req, res) => {
  const { startTime, endTime, idTeacher, idCourse } = req.body;

  if (!startTime || !endTime || !idTeacher || !idCourse) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  const query =
    "INSERT INTO event (startTime, endTime, idTeacher, idCourse) VALUES (?, ?, ?, ?)";
  db.query(query, [startTime, endTime, idTeacher, idCourse], (err, results) => {
    if (err) {
      console.error("Error creating event:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    res.status(201).json({
      status: 201,
      message: "Event created successfully",
      data: { startTime, endTime, idTeacher, idCourse },
    });
  });
};

// Update an event by startTime and endTime
export const updateEvent = (req, res) => {
  const { startTime, endTime } = req.params;
  const { newStartTime, newEndTime, idTeacher, idCourse } = req.body;

  if (!newStartTime || !newEndTime || !idTeacher || !idCourse) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  const query =
    "UPDATE event SET startTime = ?, endTime = ?, idTeacher = ?, idCourse = ? WHERE startTime = ? AND endTime = ?";
  db.query(
    query,
    [newStartTime, newEndTime, idTeacher, idCourse, startTime, endTime],
    (err, results) => {
      if (err) {
        console.error("Error updating event:", err);
        return res
          .status(500)
          .json({ status: 500, message: "Internal Server Error" });
      }
      res
        .status(200)
        .json({ status: 200, message: "Event updated successfully" });
    }
  );
};

// Delete an event by startTime and endTime
export const deleteEvent = (req, res) => {
  const { startTime, endTime } = req.params;
  const query = "DELETE FROM event WHERE startTime = ? AND endTime = ?";
  db.query(query, [startTime, endTime], (err, results) => {
    if (err) {
      console.error("Error deleting event:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
    res
      .status(200)
      .json({ status: 200, message: "Event deleted successfully" });
  });
};
