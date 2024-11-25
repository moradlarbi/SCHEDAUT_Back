import express from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../models/eventModels.js";

const router = express.Router();

// Routes
router.get("/", getAllEvents); // Fetch all events
router.get("/:startTime/:endTime", getEventById); // Fetch an event by startTime and endTime
router.post("/", createEvent); // Create a new event
router.put("/:startTime/:endTime", updateEvent); // Update an event by startTime and endTime
router.delete("/:startTime/:endTime", deleteEvent); // Delete an event by startTime and endTime

export default router;
