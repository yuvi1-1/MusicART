const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    albumId: {
      type: String,
      required: true,
    },

    albumName: {
      type: String,
      required: true,
    },

    artistName: {
      type: String,
      required: true,
    },

    artworkUrl: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 0.5,
      max: 5,
    },

    reviewText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    mood: {
      type: String,
      default: "",
    },

    favoriteTrack: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);