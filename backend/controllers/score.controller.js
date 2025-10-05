import CognitiveScore from "../models/cognitiveScore.model.js";

// POST /api/scores  → Save new score
export const submitScore = async (req, res) => {
    try {
        const { score, idleTime, tabSwitches, activityTime } = req.body;

        if (typeof score !== 'number' || score < 0) {
          return res.status(400).json({ msg: "Invalid score" });
        }
        if (typeof activityTime !== 'number' || activityTime < 0) {
            return res.status(400).json({ msg: "Invalid activityTime" });
        }
        if (typeof idleTime !== 'number' || idleTime < 0) {
            return res.status(400).json({ msg: "Invalid idleTime" });
        }
        if (typeof tabSwitches !== 'number' || tabSwitches < 0) {
            return res.status(400).json({ msg: "Invalid tabSwitches" });
        }

        // Calculate base focus score
        const baseScore = (activityTime / (activityTime + idleTime)) * 100;

        // Penalty for distractions
        const penalty = tabSwitches * 2;

        // Final focus score (min 0)
        const focusScore = Math.max(0, baseScore - penalty);

        // Save score in DB
        const newScore = new CognitiveScore({
            user: req.userId,   // comes from verifyToken
            score,
            idleTime,
            tabSwitches,
            activityTime,
            focusScore
        });

        await newScore.save();

        res.status(201).json({
            success: true,
            message: "Score submitted successfully",
            data: newScore
        });
    } catch (error) {
        console.error("Error submitting score:", error);
        res.status(500).json({
            success: false,
            message: "Error submitting score",
            error: error.message
        });
    }
};

// GET /api/scores  → Fetch all scores of logged-in user
export const getScores = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;   // current page
    const limit = parseInt(req.query.limit) || 10; // items per page
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { user: req.userId };

     // Filter by last X days (range)
    if (req.query.range) {
      const days = parseInt(req.query.range);
      if (!isNaN(days) && days > 0) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        filter.createdAt = { $gte: startDate };
      }
    }

    // Filter by custom from/to dates
    if (req.query.from && req.query.to) {
      const fromDate = new Date(req.query.from);
      const toDate = new Date(req.query.to);

      if (!isNaN(fromDate) && !isNaN(toDate)) {
        filter.createdAt = { $gte: fromDate, $lte: toDate };
      }
    }

    // Count total scores for the logged-in user
    const totalScores = await CognitiveScore.countDocuments(filter);

     // Fetch paginated scores
    const scores = await CognitiveScore.find({ user: req.userId })
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    
    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalScores / limit),
      totalScores,
      results: scores.length,
      data: scores
    });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching scores", error: err.message });
  }
};

// GET /api/scores/summary
export const getScoreSummary = async (req, res) => {
  try {
    const summary = await Score.aggregate([
      { $match: { user: req.userId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          avgFocus: { $avg: "$focusScore" },
          totalActivity: { $sum: "$activityTime" },
          totalIdle: { $sum: "$idleTime" }
        }
      },
      { $sort: { _id: -1 } }
    ]);
    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    // 1 Fetch all scores for the logged-in user
    const scores = await CognitiveScore.find({ user: req.userId });

    const totalScoresCount = scores.length;

    // 2 Average score
    const averageScore =
      totalScoresCount > 0
        ? scores.reduce((acc, s) => acc + s.score, 0) / totalScoresCount
        : 0;

    // 3 Average focus score
    const averageFocusScore =
      totalScoresCount > 0
        ? scores.reduce((acc, s) => acc + (s.focusScore || 0), 0) / totalScoresCount
        : 0;

    // 4 Best & worst scores
    const bestScore = totalScoresCount > 0 ? Math.max(...scores.map(s => s.score)) : 0;
    const worstScore = totalScoresCount > 0 ? Math.min(...scores.map(s => s.score)) : 0;

    // 5 Best day (highest single score)
    let bestDay = null;
    if (totalScoresCount > 0) {
      const bestScoreObj = scores.reduce((max, s) => (s.score > max.score ? s : max), scores[0]);
      bestDay = bestScoreObj.createdAt.toISOString().split("T")[0];
    }

    // 6 Daily breakdown
    const dailyBreakdownMap = {};
    scores.forEach(s => {
      const dateStr = s.createdAt.toISOString().split("T")[0];
      if (!dailyBreakdownMap[dateStr]) {
        dailyBreakdownMap[dateStr] = { totalScore: 0, count: 0 };
      }
      dailyBreakdownMap[dateStr].totalScore += s.score;
      dailyBreakdownMap[dateStr].count += 1;
    });

    const dailyBreakdown = Object.entries(dailyBreakdownMap).map(([date, info]) => ({
      date,
      averageScore: info.totalScore / info.count,
      count: info.count
    }));

    // 7 Send response
    res.status(200).json({
      success: true,
      totalScores: totalScoresCount,
      averageScore,
      averageFocusScore,
      bestScore,
      worstScore,
      bestDay,
      dailyBreakdown
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error fetching analytics", error: err.message });
  }
};

