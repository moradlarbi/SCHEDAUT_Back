import express from "express";
import { validateRequestBody } from "zod-express-middleware";
import { z } from "zod";
import {
  getPassword,
  getUserByEmail,
  createUser,
  getUser,
} from "../models/authModels.js";
import jwt from "jsonwebtoken";
import isUserMidd from "../middlewares/authentification.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Route pour l'inscription
router.post(
  "/signup",
  validateRequestBody(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
      first_name: z.string().min(1),
      last_name: z.string().min(1),
      role: z.string().optional(),
    })
  ),
  async (req, res) => {
    try {
      const {
        email,
        password,
        first_name,
        last_name,
        role = "student",
      } = req.body;

      // Vérifier si l'utilisateur existe déjà avec cet email
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .json({ status: 400, message: "Email already exists" });
      }

      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      // Créer un nouvel utilisateur
      const newUser = await createUser({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        role,
      });

      res.status(201).json({
        status: 201,
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  }
);

// Route pour la connexion
router.post(
  "/login",
  validateRequestBody(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  ),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log(req.body);

      // Récupérer l'utilisateur par email
      const user = await getPassword(email);
      if (!user) {
        return res
          .status(401)
          .json({ status: 401, message: "Invalid email or password" });
      }

      // Vérifier le mot de passe
      console.log(user);
      const isPasswordCorrect = await bcrypt.compareSync(
        password,
        user.password
      );
      console.log(isPasswordCorrect);
      if (!isPasswordCorrect) {
        return res
          .status(401)
          .json({ status: 401, message: "Invalid 2 email or password" });
      }

      // Générer un token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_PASSPHRASE || "SchedautPassword",
        { expiresIn: "1d" }
      );

      // Envoyer le cookie avec le token
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      // Supprimer le mot de passe avant d'envoyer la réponse
      delete user.password;
      res.status(200).json({ status: 200, message: "OK", data: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  }
);

// Vérification de l'authentification
router.get("/isAuthenticated", isUserMidd, async (req, res) => {
  res.status(200).json({ status: 200, message: "OK", data: req.user });
});

// Déconnexion
router.get("/logout", (_req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ status: 200, message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
});

export default router;
