/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: API for managing courses
 */

import express from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getActiveCourses,
} from "../models/courseModels.js";
import isUserMidd from "../middlewares/authentification.js";
const router = express.Router();

// Routes
/**
 * @swagger
 * /course/active:
 *   get:
 *     summary: Get all active courses
 *     tags: [Courses]
 *     description: Retrieve a list of all active courses.
 *     responses:
 *       200:
 *         description: Successfully fetched active courses.
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
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Mathematics
 *                       nb_hour:
 *                         type: integer
 *                         example: 40
 *                       active:
 *                         type: boolean
 *                         example: true
 */
router.get("/active", isUserMidd, getActiveCourses);
/**
 * @swagger
 * /course:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     description: Retrieve a list of all courses.
 *     responses:
 *       200:
 *         description: Successfully fetched courses.
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
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Physics
 *                       nb_hour:
 *                         type: integer
 *                         example: 45
 *                       active:
 *                         type: boolean
 *                         example: true
 */
router.get("/", isUserMidd, getAllCourses); // Fetch all courses
/**
 * @swagger
 * /course/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     description: Retrieve details of a specific course by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Successfully fetched course details.
 *       404:
 *         description: Course not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get("/:id", isUserMidd, getCourseById); // Fetch a course by ID
/**
 * @swagger
 * /course:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     description: Add a new course to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Chemistry
 *               nb_hour:
 *                 type: integer
 *                 example: 30
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Course created successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal Server Error.
 */
router.post("/", isUserMidd, createCourse); // Create a new course
/**
 * @swagger
 * /course/{id}:
 *   put:
 *     summary: Update a course by ID
 *     tags: [Courses]
 *     description: Update details of an existing course by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Biology
 *               nb_hour:
 *                 type: integer
 *                 example: 50
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Course updated successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal Server Error.
 */
router.put("/:id", isUserMidd, updateCourse); // Update a course by ID
/**
 * @swagger
 * /course/{id}:
 *   delete:
 *     summary: Delete a course by ID
 *     tags: [Courses]
 *     description: Mark a course as inactive by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course marked as inactive successfully.
 *       404:
 *         description: Course not found.
 *       500:
 *         description: Internal Server Error.
 */
router.delete("/:id", isUserMidd, deleteCourse); // Delete a course by ID

export default router;
