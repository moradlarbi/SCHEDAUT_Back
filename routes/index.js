import express from 'express';

const router = express.Router();

// Import route modules
import authRoutes from './auth.js';


router.use("/auth", authRoutes)

export default router;