const Favorite = require("../models/Favorite");

async function addFavorite(req, res) {
  try {
    const { albumId, albumName, artistName, artworkUrl, genre, albumUrl } = req.body;

    if (!albumId || !albumName || !artistName || !artworkUrl) {
      return res.status(400).json({ message: "Album details are required" });
    }

    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      albumId,
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "Album already saved" });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      albumId,
      albumName,
      artistName,
      artworkUrl,
      genre,
      albumUrl,
    });

    res.status(201).json({
      message: "Album saved successfully",
      favorite,
    });
  } catch (error) {
    console.error("Add favorite error:", error.message);
    res.status(500).json({ message: "Server error while saving album" });
  }
}

async function getMyFavorites(req, res) {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(favorites);
  } catch (error) {
    console.error("Get favorites error:", error.message);
    res.status(500).json({ message: "Server error while fetching favorites" });
  }
}

async function removeFavorite(req, res) {
  try {
    const { albumId } = req.params;

    const favorite = await Favorite.findOne({
      user: req.user._id,
      albumId,
    });

    if (!favorite) {
      return res.status(404).json({ message: "Saved album not found" });
    }

    await favorite.deleteOne();

    res.json({ message: "Album removed from saved albums" });
  } catch (error) {
    console.error("Remove favorite error:", error.message);
    res.status(500).json({ message: "Server error while removing album" });
  }
}

module.exports = {
  addFavorite,
  getMyFavorites,
  removeFavorite,
};