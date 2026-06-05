const express = require("express");

const {
  searchAlbums,
  getAlbumTracks,
} = require("../controllers/musicController");

const router = express.Router();

router.get("/search", searchAlbums);
router.get("/albums/:id/tracks", getAlbumTracks);

module.exports = router;