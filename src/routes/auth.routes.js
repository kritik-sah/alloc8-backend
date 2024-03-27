import express from "express";
import { logout, signIn } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signin", signIn);
router.post("/logout", logout);

export default router;
