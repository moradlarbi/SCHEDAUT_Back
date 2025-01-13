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
import isUserMidd from "../middlewares/authentification.js"
const router = express.Router();

// Routes
router.get("/teacher/:idTeacher",isUserMidd, getEventsByTeacher);
router.get("/class/:idClass",isUserMidd, getEventsByClass); // Fetch all events by class
router.get("/:startTime/:endTime",isUserMidd, getEventById); // Fetch an event by startTime and endTime
router.get("/filters/", getFilteredEvents);

export default router;
