import express from "express";
import { validateRequestBody } from "zod-express-middleware";
import { z } from "zod";
import { getAllClasses, getClassById, createClass, updateClass, deleteClass } from "../models/classModels.js";

const router = express.Router();

// Schema for validating request body
const classSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nb_stud: z.number().optional().default(0),
});

// Get all classes
router.get("/", async (req, res) => {
  try {
    const classes = await getAllClasses();
    res.status(200).json({ status: 200, data: classes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
});

// Get class by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const classData = await getClassById(id);
    if (!classData) {
      return res.status(404).json({ status: 404, message: "Class not found" });
    }
    res.status(200).json({ status: 200, data: classData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
});

// Create a new class
router.post(
  "/",
  validateRequestBody(classSchema),
  async (req, res) => {
    try {
      const newClass = await createClass(req.body);
      res.status(201).json({ status: 201, message: "Class created", data: newClass });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  }
);

// Update a class
router.put(
  "/:id",
  validateRequestBody(classSchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedClass = await updateClass(id, req.body);
      res.status(200).json({ status: 200, message: "Class updated", data: updatedClass });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  }
);

// Delete a class
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteClass(id);
    res.status(200).json({ status: 200, message: "Class deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
});

export default router;
