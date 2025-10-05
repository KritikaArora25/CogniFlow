import express from "express";
import { generateSuggestion, generateTimetable } from "../utils/aiLogic.js";

const router = express.Router();

// /api/ai/suggestion?score=82
router.get("/suggestion", (req, res) => {
  const { score } = req.query;
  if (!score) return res.status(400).json({ error: "Score required" });

  const suggestion = generateSuggestion(Number(score));
  res.json({ suggestion });
});

// /api/ai/timetable?score=82
router.get("/timetable", (req, res) => {
  const { score } = req.query;
  if (!score) return res.status(400).json({ error: "Score required" });

  const timetable = generateTimetable(Number(score));
  res.json({ timetable });
});

export default router;
