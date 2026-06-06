const express = require("express");

const {
  createReview,
  getAlbumReviews,
  getMyReviews,
  deleteReview,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createReview);
router.get("/album/:albumId", getAlbumReviews);
router.get("/me", protect, getMyReviews);
router.delete("/:id", protect, deleteReview);

module.exports = router;