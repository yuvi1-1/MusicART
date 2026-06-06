const mongoose = require("mongoose");

const diaryEntrySchema = new mongoose.Schema(
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

    listenedDate: {
      type: Date,
      required: true,
    },

    mood: {
      type: String,
      default: "",
    },

    favoriteTrack: {
      type: String,
      default: "",
    },

    note: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    rating: {
      type: Number,
      min: 0.5,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DiaryEntry", diaryEntrySchema);