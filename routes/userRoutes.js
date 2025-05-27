import express from "express";
import { createUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

//route för att registrera/skapa användare
router.post("/register", createUser);
router.post("/login", loginUser);

export default router;
