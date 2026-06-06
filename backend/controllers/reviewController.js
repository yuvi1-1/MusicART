const Review = require("../models/Review");

async function createReview(req, res) {
  try {
    const {
      albumId,
      albumName,
      artistName,
      artworkUrl,
      rating,
      reviewText,
      mood,
      favoriteTrack,
    } = req.body;

    if (!albumId || !albumName || !artistName || !artworkUrl || !rating || !reviewText) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    if (rating < 0.5 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 0.5 and 5" });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      albumId,
    });

    if (existingReview) {
      return res.status(400).json({ message: "You already reviewed this album" });
    }

    const review = await Review.create({
      user: req.user._id,
      albumId,
      albumName,
      artistName,
      artworkUrl,
      rating,
      reviewText,
      mood,
      favoriteTrack,
    });

    const populatedReview = await review.populate("user", "username avatarUrl");

    res.status(201).json({
      message: "Review created successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("Create review error:", error.message);
    res.status(500).json({ message: "Server error while creating review" });
  }
}

async function getAlbumReviews(req, res) {
  try {
    const { albumId } = req.params;

    const reviews = await Review.find({ albumId })
      .populate("user", "username avatarUrl")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    res.json({
      reviews,
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
    });
  } catch (error) {
    console.error("Get album reviews error:", error.message);
    res.status(500).json({ message: "Server error while fetching reviews" });
  }
}

async function getMyReviews(req, res) {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Get my reviews error:", error.message);
    res.status(500).json({ message: "Server error while fetching your reviews" });
  }
}

async function deleteReview(req, res) {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this review" });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error.message);
    res.status(500).json({ message: "Server error while deleting review" });
  }
}

module.exports = {
  createReview,
  getAlbumReviews,
  getMyReviews,
  deleteReview,
};