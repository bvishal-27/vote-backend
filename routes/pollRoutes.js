const express = require("express");
const router = express.Router();
const Poll = require("../models/Poll");
const auth = require("../middleware/authMiddleware");

// --- PROTECTED ROUTES (Require Auth) ---

// 1. CREATE A POLL i
router.post("/create", auth, async (req, res) => {
  try {
    const { title, questions, settings } = req.body;
    const newPoll = new Poll({
      creator: req.user,
      title,
      questions,
      settings,
    });
    await newPoll.save();
    res.status(201).json(newPoll);
  } catch (err) {
    console.error("DB Save Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. GET USER'S POLLS (For Dashboard)
router.get("/user", auth, async (req, res) => {
  try {
    const polls = await Poll.find({ creator: req.user }).sort({
      createdAt: -1,
    });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch your polls" });
  }
});

// --- PUBLIC ROUTES (No Auth Required) ---

// 3. GET POLL BY ID (For Voting View)
// Use this specific path to avoid collisions with other routes
router.get("/public/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    res.json(poll);
  } catch (err) {
    res.status(400).json({ error: "Invalid Poll ID format" });
  }
});

// 4. SUBMIT A VOTE
// Uses PATCH and $inc for a professional, atomic update
router.patch("/vote/:id", async (req, res) => {
  try {
    const { questionIndex, optionIndex } = req.body;

    const result = await Poll.findOneAndUpdate(
      { _id: req.params.id },
      {
        $inc: {
          [`questions.${questionIndex}.options.${optionIndex}.votes`]: 1,
        },
      },
      { new: true },
    );

    if (!result) return res.status(404).json({ error: "Poll not found" });
    res.status(200).json({ msg: "Vote recorded successfully!" });
  } catch (err) {
    console.error("Vote Error:", err.message);
    res.status(500).json({ error: "Failed to submit vote" });
  }
});

// 5. GET POLL RESULTS
router.get("/:id/results", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    const results = {
      title: poll.title,
      questions: poll.questions.map((q) => ({
        text: q.text,
        totalVotes: q.options.reduce((sum, opt) => sum + (opt.votes || 0), 0),
        options: q.options.map((opt) => ({
          text: opt.text,
          votes: opt.votes || 0,
        })),
      })),
    };
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

// --- DESTRUCTIVE ROUTES (Require Auth) ---

// 6. DELETE A POLL
router.delete("/:id", auth, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    // Security: Check if logged-in user is the owner
    if (poll.creator.toString() !== req.user) {
      return res.status(401).json({ error: "User not authorized" });
    }

    await poll.deleteOne();
    res.json({ msg: "Poll removed" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
