/**
 * @swagger
 * tags:
 *   name: Salles
 *   description: API for managing classrooms (salles)
 */

import express from "express";
import {
  getAllSalles,
  getSalleById,
  createSalle,
  updateSalle,
  deleteSalle,
} from "../models/salleModels.js";
import isUserMidd from "../middlewares/authentification.js";
const router = express.Router();

// Routes
/**
 * @swagger
 * /api/salle:
 *   get:
 *     summary: Get all salles
 *     tags: [Salles]
 *     description: Retrieve a list of all classrooms (salles).
 *     responses:
 *       200:
 *         description: Successfully fetched all salles.
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
 *                       name:
 *                         type: string
 *                         example: Room A
 *                       capacity:
 *                         type: number
 *                         example: 30
 *                       active:
 *                         type: boolean
 *                         example: true
 */
router.get("/", isUserMidd, getAllSalles); // Fetch all salles
/**
 * @swagger
 * /api/salle/{id}:
 *   get:
 *     summary: Get a salle by ID
 *     tags: [Salles]
 *     description: Retrieve details of a specific classroom (salle) by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the salle
 *     responses:
 *       200:
 *         description: Successfully fetched salle details.
 *       404:
 *         description: Salle not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get("/:id", isUserMidd, getSalleById); // Fetch salle by ID
/**
 * @swagger
 * /api/salle:
 *   post:
 *     summary: Create a new salle
 *     tags: [Salles]
 *     description: Add a new classroom (salle) to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Room A
 *               capacity:
 *                 type: number
 *                 example: 30
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Salle created successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal Server Error.
 */
router.post("/", isUserMidd, createSalle); // Create a new salle
/**
 * @swagger
 * /api/salle/{id}:
 *   put:
 *     summary: Update a salle by ID
 *     tags: [Salles]
 *     description: Update the details of an existing classroom (salle) by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the salle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Room B
 *               capacity:
 *                 type: number
 *                 example: 40
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Salle updated successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal Server Error.
 */
router.put("/:id", isUserMidd, updateSalle); // Update a salle by ID
/**
 * @swagger
 * /api/salle/{id}:
 *   delete:
 *     summary: Delete a salle by ID
 *     tags: [Salles]
 *     description: Mark a classroom (salle) as inactive by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the salle
 *     responses:
 *       200:
 *         description: Salle marked as inactive successfully.
 *       404:
 *         description: Salle not found.
 *       500:
 *         description: Internal Server Error.
 */
router.delete("/:id", isUserMidd, deleteSalle); // Delete a salle by ID

export default router;
