import db from "../db.js";

// Fetch all events
export const getEventsByClass = (req, res) => {
  console.log(req.params);
  const idClass = req.params.idClass;

  const query = `
    SELECT 
      e.startTime as start,
      e.endTime as end,
      CONCAT(u.first_name, ' ', u.last_name) AS teacher,
      c.name AS class,
      co.name AS title
    FROM 
      event e
    JOIN 
      users u ON e.idTeacher = u.id
    JOIN 
      class c ON e.idClass = c.id
    JOIN 
      course co ON e.idCourse = co.id
    WHERE 
      e.idClass = ?;
  `;

  db.query(query, [idClass], (err, results) => {
    if (err) {
      console.error("Error fetching events:", err);
      return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }

    const BREAKS = [
      { start: "10:30:00", end: "10:45:00" },
      { start: "14:30:00", end: "14:45:00" },
    ];

    const processedResults = [];

    results.forEach(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

      let shouldSplit = false;

      BREAKS.forEach(breakPeriod => {
        const breakStart = new Date(eventStart.toISOString().split("T")[0] + "T" + breakPeriod.start);
        const breakEnd = new Date(eventStart.toISOString().split("T")[0] + "T" + breakPeriod.end);

        // Check if event overlaps with break
        if (eventStart < breakEnd && eventEnd > breakStart) {
          shouldSplit = true;

          // If the event starts before the break, add the first part
          if (eventStart < breakStart) {
            processedResults.push({
              ...event,
              start: event.start,
              end: breakStart.toISOString(),
            });
          }

          // If the event ends after the break, add the second part
          if (eventEnd > breakEnd) {
            processedResults.push({
              ...event,
              start: breakEnd.toISOString(),
              end: event.end,
            });
          }
        }
      });

      // If no split is required, push the event as is
      if (!shouldSplit) {
        processedResults.push({
          ...event,
          start: event.start.toISOString(),
          end: event.end.toISOString(),
        });
      }
    });

    res.status(200).json({ status: 200, message: "OK", data: processedResults });
  });
};



// Fetch an event by startTime and endTime
export const getEventById = (req, res) => {
  const { startTime, endTime } = req.params;
  const query =
    "SELECT * FROM event WHERE startTime = ? AND endTime = ? AND active = 1";
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

export const createEvent = (req, res) => {
  const { startTime, endTime, idTeacher, idCourse, idClass } = req.body;

  if (!startTime || !endTime || !idTeacher || !idCourse) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  const query = `
    INSERT INTO event (startTime, endTime, idTeacher, idCourse, idClass) 
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [startTime, endTime, idTeacher, idCourse, idClass || null],
    (err, results) => {
      if (err) {
        console.error("Error creating event:", err);
        return res
          .status(500)
          .json({ status: 500, message: "Internal Server Error" });
      }
      res.status(201).json({
        status: 201,
        message: "Event created successfully",
        data: {
          startTime,
          endTime,
          idTeacher,
          idCourse,
          idClass: idClass || null,
        },
      });
    }
  );
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
// Mark an event as inactive by startTime and endTime
export const deleteEventByTime = (req, res) => {
  const { startTime, endTime } = req.params;
  const query = `
    UPDATE event 
    SET active = false 
    WHERE startTime = ? AND endTime = ?`;

  db.query(query, [startTime, endTime], (err, results) => {
    if (err) {
      console.error("Error updating event:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ status: 404, message: "Event not found" });
    }

    res
      .status(200)
      .json({ status: 200, message: "Event marked as inactive successfully" });
  });
};

// Mark an event as inactive by id
// Mark an event as inactive by id
export const deleteEventById = (req, res) => {
  const { id } = req.params;
  const query = `
    UPDATE event 
    SET active = false 
    WHERE id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error updating event:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ status: 404, message: "Event not found" });
    }

    res
      .status(200)
      .json({ status: 200, message: "Event marked as inactive successfully" });
  });
};

export const getFilteredEvents = (req, res) => {
  const { idClass, idTeacher, date } = req.query;

  // Determine the reference date: provided date or current date
  const referenceDate = date ? new Date(date) : new Date();
  const startDate = new Date(referenceDate);
  const endDate = new Date(referenceDate);
  endDate.setDate(startDate.getDate() + 7); // Add 7 days to the start date

  const queryParams = [];
  let query = `
    SELECT * 
    FROM event 
    WHERE active = 1 
      AND startTime >= ? 
      AND startTime < ?
  `;

  queryParams.push(startDate, endDate);

  // Apply filters if provided
  if (idClass) {
    query += " AND idClass = ?";
    queryParams.push(idClass);
  }

  if (idTeacher) {
    query += " AND idTeacher = ?";
    queryParams.push(idTeacher);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching events:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }

    res.status(200).json({ status: 200, message: "OK", data: results });
  });
};
