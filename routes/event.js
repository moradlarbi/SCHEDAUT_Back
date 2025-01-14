/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API for managing events (class schedules, teacher schedules, etc.)
 */

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
import isUserMidd from "../middlewares/authentification.js";
const router = express.Router();

// Routes
/**
 * @swagger
 * /api/event/teacher/{idTeacher}:
 *   get:
 *     summary: Get events by teacher
 *     tags: [Events]
 *     description: Retrieve a list of events for a specific teacher.
 *     parameters:
 *       - in: path
 *         name: idTeacher
 *         required: true
 *         schema:
 *           type: integer
 *         description: The teacher's ID
 *     responses:
 *       200:
 *         description: Successfully fetched events.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       start:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-01-15T09:00:00Z
 *                       end:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-01-15T10:30:00Z
 *                       title:
 *                         type: string
 *                         example: Mathematics
 *                       salle:
 *                         type: string
 *                         example: Room A
 *       500:
 *         description: Internal Server Error
 */
router.get("/teacher/:idTeacher", isUserMidd, getEventsByTeacher);
/**
 * @swagger
 * /api/event/class/{idClass}:
 *   get:
 *     summary: Get events by class
 *     tags: [Events]
 *     description: Retrieve a list of events for a specific class.
 *     parameters:
 *       - in: path
 *         name: idClass
 *         required: true
 *         schema:
 *           type: integer
 *         description: The class ID
 *     responses:
 *       200:
 *         description: Successfully fetched events.
 *       500:
 *         description: Internal Server Error
 */
router.get("/class/:idClass", isUserMidd, getEventsByClass); // Fetch all events by class
/**
 * @swagger
 * /api/event/{startTime}/{endTime}:
 *   get:
 *     summary: Get an event by time range
 *     tags: [Events]
 *     description: Retrieve an event based on its start time and end time.
 *     parameters:
 *       - in: path
 *         name: startTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-01-15T09:00:00Z
 *         description: The start time of the event
 *       - in: path
 *         name: endTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-01-15T10:30:00Z
 *         description: The end time of the event
 *     responses:
 *       200:
 *         description: Successfully fetched event.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Internal Server Error
 */
router.get("/:startTime/:endTime", isUserMidd, getEventById); // Fetch an event by startTime and endTime
/**
 * @swagger
 * /api/event/filters:
 *   get:
 *     summary: Get filtered events
 *     tags: [Events]
 *     description: Retrieve events filtered by class, teacher, or date.
 *     parameters:
 *       - in: query
 *         name: idClass
 *         schema:
 *           type: integer
 *         description: Filter by class ID
 *       - in: query
 *         name: idTeacher
 *         schema:
 *           type: integer
 *         description: Filter by teacher ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-01-15
 *         description: Filter events for a specific date
 *     responses:
 *       200:
 *         description: Successfully fetched filtered events.
 *       500:
 *         description: Internal Server Error
 */
router.get("/filters/", getFilteredEvents);

export default router;
