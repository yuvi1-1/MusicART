const DiaryEntry = require("../models/DiaryEntry");

async function createDiaryEntry(req, res) {
  try {
    const {
      albumId,
      albumName,
      artistName,
      artworkUrl,
      listenedDate,
      mood,
      favoriteTrack,
      note,
      rating,
    } = req.body;

    if (!albumId || !albumName || !artistName || !artworkUrl || !listenedDate) {
      return res.status(400).json({ message: "Required album and date details are missing" });
    }

    if (rating && (rating < 0.5 || rating > 5)) {
      return res.status(400).json({ message: "Rating must be between 0.5 and 5" });
    }

    const entry = await DiaryEntry.create({
      user: req.user._id,
      albumId,
      albumName,
      artistName,
      artworkUrl,
      listenedDate,
      mood,
      favoriteTrack,
      note,
      rating,
    });

    res.status(201).json({
      message: "Diary entry created successfully",
      entry,
    });
  } catch (error) {
    console.error("Create diary entry error:", error.message);
    res.status(500).json({ message: "Server error while creating diary entry" });
  }
}

async function getMyDiaryEntries(req, res) {
  try {
    const entries = await DiaryEntry.find({ user: req.user._id }).sort({
      listenedDate: -1,
      createdAt: -1,
    });

    res.json(entries);
  } catch (error) {
    console.error("Get diary entries error:", error.message);
    res.status(500).json({ message: "Server error while fetching diary entries" });
  }
}

async function deleteDiaryEntry(req, res) {
  try {
    const { id } = req.params;

    const entry = await DiaryEntry.findById(id);

    if (!entry) {
      return res.status(404).json({ message: "Diary entry not found" });
    }

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this entry" });
    }

    await entry.deleteOne();

    res.json({ message: "Diary entry deleted successfully" });
  } catch (error) {
    console.error("Delete diary entry error:", error.message);
    res.status(500).json({ message: "Server error while deleting diary entry" });
  }
}

module.exports = {
  createDiaryEntry,
  getMyDiaryEntries,
  deleteDiaryEntry,
};