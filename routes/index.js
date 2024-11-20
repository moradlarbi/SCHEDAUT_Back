import express from "express";
import userRoutes from "./users.js"; // Import the users route
import classRoutes from "./classRoutes.js";

const router = express.Router();

// Import route modules
import authRoutes from "./auth.js";

router.use("/auth", authRoutes);
router.use("/users", userRoutes); // Add users route
router.use("/class", classRoutes);

export default router;
