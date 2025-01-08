import express from "express";
import {
  getEventsByClass,
  getEventById,
  createEvent,
  updateEvent,
  deleteEventByTime,
  deleteEventById,
  getFilteredEvents,
  getEventsByTeacher,
} from "../models/eventModels.js";

const router = express.Router();

// Routes
router.get("/teacher/:idTeacher", getEventsByTeacher);
router.get("/class/:idClass", getEventsByClass); // Fetch all events by class
router.get("/:startTime/:endTime", getEventById); // Fetch an event by startTime and endTime
router.post("/", createEvent); // Create a new event
router.put("/:startTime/:endTime", updateEvent); // Update an event by startTime and endTime
router.delete("/:startTime/:endTime", deleteEventByTime); // Delete an event by startTime and endTime
router.delete("/:id", deleteEventById); // Delete an event by startTime and endTime
router.get("/filters/", getFilteredEvents);

export default router;
