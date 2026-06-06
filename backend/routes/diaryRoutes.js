const express = require("express");

const {
  createDiaryEntry,
  getMyDiaryEntries,
  deleteDiaryEntry,
} = require("../controllers/diaryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createDiaryEntry);
router.get("/me", protect, getMyDiaryEntries);
router.delete("/:id", protect, deleteDiaryEntry);

module.exports = router;