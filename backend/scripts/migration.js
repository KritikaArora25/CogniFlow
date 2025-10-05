import mongoose from "mongoose";
import dotenv from "dotenv";
import CognitiveScore from "../models/cognitiveScore.model.js";

dotenv.config(); 

const migrateScores = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Fetch all scores without focusScore
    const oldScores = await CognitiveScore.find({ focusScore: { $exists: false } });

    console.log(`Found ${oldScores.length} old records to migrate`);

    for (let s of oldScores) {
      // Map old fields to new ones
      const activityTime = s.focusedTime || 0;
      const tabSwitches = s.distractions || 0;
      const idleTime = 0; // we didn’t track before, so default 0

      // Calculate focusScore
      const totalTime = activityTime + idleTime;
      const baseScore = totalTime > 0 ? (activityTime / totalTime) * 100 : 0;
      const penalty = tabSwitches * 2;
      const focusScore = Math.max(0, baseScore - penalty);

      // Update the record
      s.activityTime = activityTime;
      s.idleTime = idleTime;
      s.tabSwitches = tabSwitches;
      s.focusScore = focusScore;

      await s.save();
      console.log(`✅ Migrated score ${s._id}`);
    }

    console.log("🎉 Migration complete!");
    process.exit(0);
    } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
};

migrateScores();
