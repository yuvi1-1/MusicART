import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import {
  getMyDiaryEntries,
  deleteDiaryEntry,
  type DiaryEntry,
} from "../services/diaryService";
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
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

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

  async function fetchDiaryEntries() {
  try {
    const data = await getMyDiaryEntries();
    setDiaryEntries(data);
  } catch (err) {
    console.error(err);
  }
}

  async function handleDeleteDiaryEntry(entryId: string) {
  try {
    await deleteDiaryEntry(entryId);
    setDiaryEntries((prev) => prev.filter((entry) => entry._id !== entryId));
  } catch (err) {
    console.error(err);
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
    fetchDiaryEntries();
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
        
        <section className="profile-section">
  <h2>Music Diary</h2>

  {diaryEntries.length === 0 && <p>No diary entries yet.</p>}

  <div className="diary-list">
    {diaryEntries.map((entry) => (
      <div className="diary-entry-card" key={entry._id}>
        <img src={entry.artworkUrl} alt={entry.albumName} />

        <div>
          <h3>{entry.albumName}</h3>
          <p>{entry.artistName}</p>

          <p>
            Listened on:{" "}
            {new Date(entry.listenedDate).toLocaleDateString()}
          </p>

          {entry.rating && <p>⭐ {entry.rating}/5</p>}
          {entry.mood && <p>Mood: {entry.mood}</p>}
          {entry.favoriteTrack && (
            <p>Favorite track: {entry.favoriteTrack}</p>
          )}
          {entry.note && <p>{entry.note}</p>}

          <button
            className="remove-album-button"
            onClick={() => handleDeleteDiaryEntry(entry._id)}
          >
            Delete Entry
          </button>
        </div>
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