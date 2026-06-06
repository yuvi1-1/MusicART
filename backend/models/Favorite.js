const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
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

    genre: {
      type: String,
      default: "",
    },

    albumUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

favoriteSchema.index({ user: 1, albumId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);