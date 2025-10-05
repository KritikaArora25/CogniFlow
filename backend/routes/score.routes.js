import express from "express";
import { submitScore, getScores, getScoreSummary,getAnalytics } from "../controllers/score.controller.js";
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Save new score
router.post("/submit", verifyToken, submitScore);

// Get user’s scores
router.get("/all", verifyToken, getScores);

//analytics for the app (like average focus per day/week)
router.get("/summary", verifyToken, getScoreSummary);
router.get("/analytics", verifyToken, getAnalytics);

export default router;
