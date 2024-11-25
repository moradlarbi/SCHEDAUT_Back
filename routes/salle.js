import express from "express";
import {
  getAllSalles,
  getSalleById,
  createSalle,
  updateSalle,
  deleteSalle,
} from "../models/salleModels.js";

const router = express.Router();

// Routes
router.get("/", getAllSalles); // Fetch all salles
router.get("/:id", getSalleById); // Fetch salle by ID
router.post("/", createSalle); // Create a new salle
router.put("/:id", updateSalle); // Update a salle by ID
router.delete("/:id", deleteSalle); // Delete a salle by ID

export default router;
