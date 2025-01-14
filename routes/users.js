/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and related operations
 */

import express from "express";
import {
  getAllUsers,
  getUserById,
  createUserController,
  updateUser,
  deleteUserController,
  getTeachers,
} from "../models/usersModels.js";
import isUserMidd from "../middlewares/authentification.js";
const router = express.Router();

// Routes

/**
 * @swagger
 * /api/users/teacher:
 *   get:
 *     summary: Get all teachers
 *     tags: [Users]
 *     description: Retrieve a list of all teachers.
 *     responses:
 *       200:
 *         description: Successfully fetched teachers.
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
 *                         type: number
 *                         example: 1
 *                       first_name:
 *                         type: string
 *                         example: John
 *                       last_name:
 *                         type: string
 *                         example: Doe
 *                       email:
 *                         type: string
 *                         example: john.doe@example.com
 *                       idCourses:
 *                         type: array
 *                         items:
 *                           type: number
 *                           example: 101
 *       500:
 *         description: Internal Server Error
 */
router.get("/teacher", isUserMidd, getTeachers);
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Retrieve a list of all users with their class and course information.
 *     responses:
 *       200:
 *         description: Successfully fetched users.
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
 *                   example: Users fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       first_name:
 *                         type: string
 *                         example: John
 *                       last_name:
 *                         type: string
 *                         example: Doe
 *                       email:
 *                         type: string
 *                         example: john.doe@example.com
 *                       idCl:
 *                         type: number
 *                         example: 101
 *                       className:
 *                         type: string
 *                         example: Mathematics
 *                       idCourses:
 *                         type: array
 *                         items:
 *                           type: number
 *                           example: 202
 *       500:
 *         description: Internal Server Error
 */
router.get("/", getAllUsers); // Fetch all users
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     description: Retrieve a single user by their unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: Successfully fetched the user.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", isUserMidd, getUserById); // Fetch user by ID
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: Add a new user to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 example: student
 *               idClass:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal Server Error
 */
router.post("/", isUserMidd, createUserController); // Create new user
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     description: Update the details of an existing user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user's ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: newpassword123
 *               role:
 *                 type: string
 *                 example: teacher
 *               idCourses:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [101, 102]
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", isUserMidd, updateUser); // Update user by ID
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     description: Mark a user as inactive by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: User marked as inactive successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", isUserMidd, deleteUserController); // Delete user by ID

export default router;
