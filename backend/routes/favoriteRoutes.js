const express = require("express");

const {
  addFavorite,
  getMyFavorites,
  removeFavorite,
} = require("../controllers/favoriteController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addFavorite);
router.get("/me", protect, getMyFavorites);
router.delete("/:albumId", protect, removeFavorite);

module.exports = router;