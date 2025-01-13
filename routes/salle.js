import express from "express";
import {
  getAllSalles,
  getSalleById,
  createSalle,
  updateSalle,
  deleteSalle,
} from "../models/salleModels.js";
import isUserMidd from "../middlewares/authentification.js"
const router = express.Router();

// Routes
router.get("/",isUserMidd, getAllSalles); // Fetch all salles
router.get("/:id",isUserMidd, getSalleById); // Fetch salle by ID
router.post("/",isUserMidd, createSalle); // Create a new salle
router.put("/:id",isUserMidd, updateSalle); // Update a salle by ID
router.delete("/:id",isUserMidd, deleteSalle); // Delete a salle by ID

export default router;
