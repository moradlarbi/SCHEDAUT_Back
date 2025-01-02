import express from "express";

import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
} from "../models/classModels.js";

const router = express.Router();

// Create a new class
router.post("/", async (req, res) => {
  const { name, nb_stud,active } = req.body;
  if (!name || !nb_stud) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }
  try {
    const newClass = await createClass(name, nb_stud,active);
    res.status(201).json({
      status: 201,
      message: "Class created successfully",
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }

});

// Get all classes
router.get("/", async (req, res) => {
  try {

    const classes = await getClasses();
    res.status(200).json({ status: 200, data: classes });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });

  }
});

// Get class by ID
router.get("/:id", async (req, res) => {

  const { id } = req.params;
  try {
    const classData = await getClassById(id);
    res.status(200).json({ status: 200, data: classData });
  } catch (error) {
    res.status(error.message === "Class not found" ? 404 : 500).json({
      status: error.message === "Class not found" ? 404 : 500,
      message: error.message,
    });
  }
});

// Update a class
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, nb_stud,active } = req.body;
  if (!name && !nb_stud) {
    return res
      .status(400)
      .json({ status: 400, message: "No fields to update provided" });
  }
  try {
    const updatedClass = await updateClass(id, name, nb_stud,active);
    res.status(200).json({
      status: 200,
      message: "Class updated successfully",
      data: updatedClass,
    });
  } catch (error) {
    res.status(error.message === "Class not found" ? 404 : 500).json({
      status: error.message === "Class not found" ? 404 : 500,
      message: error.message,
    });
  }
});

// Soft delete a class
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteClass(id);
    res
      .status(200)
      .json({ status: 200, message: "Class deleted successfully" });
  } catch (error) {
    res.status(error.message === "Class not found" ? 404 : 500).json({
      status: error.message === "Class not found" ? 404 : 500,
      message: error.message,
    });
  }
});

export default router;
