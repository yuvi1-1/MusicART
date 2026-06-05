const axios = require("axios");

let accessToken = null;
let tokenExpirationTime = null;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpirationTime) {
    return accessToken;
  }

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
    }
  );

  accessToken = response.data.access_token;
  tokenExpirationTime = Date.now() + response.data.expires_in * 1000;

  return accessToken;
}

async function searchAlbums(req, res) {
  try {
    const query = req.query.q || "Kendrick Lamar";
    const token = await getAccessToken();

    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: "album",
        limit: 12,
      },
    });

    res.json(response.data.albums.items);
  } catch (error) {
    console.error("Spotify search error:", error.response?.data || error.message);
    res.status(500).json({ message: "Error searching albums" });
  }
}

async function getAlbumTracks(req, res) {
  try {
    const token = await getAccessToken();
    const albumId = req.params.id;

    const response = await axios.get(
      `https://api.spotify.com/v1/albums/${albumId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data.items);
  } catch (error) {
    console.error("Spotify tracks error:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching album tracks" });
  }
}

module.exports = {
  searchAlbums,
  getAlbumTracks,
};