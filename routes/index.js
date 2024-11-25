import express from "express";
import userRoutes from "./users.js"; // Import the users route
import salleRoutes from "./salle.js"; // Import salle routes
import courseRoutes from "./course.js"; // Import course routes
import eventRoutes from "./event.js"; // Import event routes
import teacherCourseRoutes from "./teacherCourse.js";

const router = express.Router();

// Import route modules
import authRoutes from "./auth.js";

router.use("/auth", authRoutes);
router.use("/users", userRoutes); // Add users route
router.use("/salle", salleRoutes); // Add salle routes
router.use("/course", courseRoutes); // Add course routes
router.use("/event", eventRoutes); // Add event routes
router.use("/teacherCourses", teacherCourseRoutes);

export default router;
