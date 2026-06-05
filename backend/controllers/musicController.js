const axios = require("axios");

async function searchAlbums(req, res) {
  try {
    const query = req.query.q || "kendrick";

    const response = await axios.get("https://itunes.apple.com/search", {
      params: {
        term: query,
        media: "music",
        entity: "album",
        limit: 12,
      },
    });

    const albums = response.data.results.map((album) => ({
      id: album.collectionId,
      name: album.collectionName,
      artistName: album.artistName,
      artworkUrl: album.artworkUrl100?.replace("100x100", "600x600"),
      releaseDate: album.releaseDate,
      trackCount: album.trackCount,
      genre: album.primaryGenreName,
      albumUrl: album.collectionViewUrl,
    }));

    res.json(albums);
  } catch (error) {
    console.error("iTunes search error:", error.message);
    res.status(500).json({ message: "Error searching albums" });
  }
}

async function getAlbumTracks(req, res) {
  try {
    const albumId = req.params.id;

    const response = await axios.get("https://itunes.apple.com/lookup", {
      params: {
        id: albumId,
        entity: "song",
      },
    });

    const tracks = response.data.results
      .filter((item) => item.wrapperType === "track")
      .map((track) => ({
        id: track.trackId,
        name: track.trackName,
        trackNumber: track.trackNumber,
        durationMs: track.trackTimeMillis,
        previewUrl: track.previewUrl,
      }));

    res.json(tracks);
  } catch (error) {
    console.error("iTunes tracks error:", error.message);
    res.status(500).json({ message: "Error fetching album tracks" });
  }
}

module.exports = {
  searchAlbums,
  getAlbumTracks,
};