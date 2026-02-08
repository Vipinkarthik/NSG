import express from "express";
import { login, seedUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);

router.post("/seed", seedUser);

export default router;
