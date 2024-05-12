import { messages_post } from "../controllers/messages_controller.js";
import express from "express";
import { LocalAuth, JwtAuth, authJWT } from "../config/auth.js";

const router = express.Router();

router.post("/messages", authJWT, messages_post);

export default router;
