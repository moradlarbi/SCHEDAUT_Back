import jwt from "jsonwebtoken";
import { getPassword } from "../models/authModels.js"; // Assurez-vous que ce modèle est correct

async function isUserMidd(req, res, next) {
  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ status: 401, message: "Unauthorized1" });
    }

    const decoded = jwt.verify(token, process.env.JWT_PASSPHRASE || "SchedautPassword");
    console.log(decoded)
    const result = await getPassword(decoded.email);
    console.log(result)
    if (!result || result.length === 0) {
      return res.status(401).json({ status: 401, message: "Unauthorized2" });
    }
    const user = result; // Assurez-vous d'accéder correctement à l'utilisateur
    console.log(user);

    // Suppression du mot de passe de l'objet utilisateur avant de le stocker dans req.user
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send("not authorized 3");
  }
}

export default isUserMidd;