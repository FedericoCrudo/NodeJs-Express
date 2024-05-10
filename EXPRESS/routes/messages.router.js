import express from "express";
import { getMessage, postMessage } from "../controllers/messages.controller.js";

const router = express.Router();
router.get("/", getMessage);
router.post("/", postMessage);

export default router;
