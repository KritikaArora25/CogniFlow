import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, required: true },

  // new fields
  idleTime: { type: Number, default: 0 },
  tabSwitches: { type: Number, default: 0 },
  activityTime: { type: Number, default: 0 },
  focusScore: { type: Number, default: 0 },

  // old fields (optional, keep for reference)
  focusedTime: { type: Number, default: 0 },
  distractions: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("CognitiveScore", scoreSchema);
