import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import {
  getMyFavorites,
  removeFavorite,
  type FavoriteAlbum,
} from "../services/favoriteService";

function Profile() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("musicart_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [favorites, setFavorites] = useState<FavoriteAlbum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchFavorites() {
    try {
      setLoading(true);
      setError("");

      const data = await getMyFavorites();
      setFavorites(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Could not load saved albums.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(albumId: string) {
    try {
      await removeFavorite(albumId);
      setFavorites((prev) =>
        prev.filter((album) => album.albumId !== albumId)
      );
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchFavorites();
  }, []);

  return (
    <>
      <NavBar />

      <main className="profile-page">
        <section className="profile-header">
          <div className="profile-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1>{user?.username}</h1>
            <p>{user?.email}</p>
            <p>Your personal MusicART profile</p>
          </div>
        </section>

        <section className="profile-section">
          <h2>Saved Albums</h2>

          {loading && <p>Loading saved albums...</p>}
          {error && <p className="auth-error">{error}</p>}

          {!loading && favorites.length === 0 && (
            <p>You have not saved any albums yet.</p>
          )}

          <div className="album-grid">
            {favorites.map((album) => (
              <div className="album-card" key={album._id}>
                <img src={album.artworkUrl} alt={album.albumName} />

                <h3>{album.albumName}</h3>
                <p>Artist: {album.artistName}</p>
                {album.genre && <p>Genre: {album.genre}</p>}

                <Link
                  to={`/album/${album.albumId}`}
                  onClick={() =>
                    localStorage.setItem(
                      "selected_album",
                      JSON.stringify({
                        id: Number(album.albumId),
                        name: album.albumName,
                        artistName: album.artistName,
                        artworkUrl: album.artworkUrl,
                        genre: album.genre || "",
                        albumUrl: album.albumUrl || "",
                        releaseDate: "",
                        trackCount: 0,
                      })
                    )
                  }
                >
                  View Album
                </Link>

                <button
                  className="remove-album-button"
                  onClick={() => handleRemove(album.albumId)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Profile;