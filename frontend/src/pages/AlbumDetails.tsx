import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { getAlbumTracks } from "../services/musicServices";
import { addFavorite } from "../services/favoriteService";
import { createDiaryEntry } from "../services/diaryService";
import {
  createReview,
  getAlbumReviews,
  type Review,
} from "../services/reviewService";
import type { Album, Track } from "../types/music";

function AlbumDetails() {
  const { id } = useParams();

  const storedAlbum = localStorage.getItem("selected_album");
  const album: Album | null = storedAlbum ? JSON.parse(storedAlbum) : null;

  const [tracks, setTracks] = useState<Track[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [mood, setMood] = useState("");
  const [favoriteTrack, setFavoriteTrack] = useState("");

  const [loading, setLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [favoriteError, setFavoriteError] = useState("");

  const [diaryDate, setDiaryDate] = useState(
  new Date().toISOString().split("T")[0]);
  const [diaryMood, setDiaryMood] = useState("");
  const [diaryFavoriteTrack, setDiaryFavoriteTrack] = useState("");
  const [diaryNote, setDiaryNote] = useState("");
  const [diaryRating, setDiaryRating] = useState(5);
  const [diaryMessage, setDiaryMessage] = useState("");
  const [diaryError, setDiaryError] = useState("");

  async function fetchTracks(albumId: string) {
    try {
      setLoading(true);
      const data = await getAlbumTracks(albumId);
      setTracks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchReviews(albumId: string) {
    try {
      const data = await getAlbumReviews(albumId);
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setTotalReviews(data.totalReviews);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (id) {
      fetchTracks(id);
      fetchReviews(id);
    }
  }, [id]);

  function formatDuration(durationMs: number) {
    if (!durationMs) return "0:00";

    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  async function handleReviewSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!album || !id) {
      setReviewError("Album details not found. Go back and open the album again.");
      return;
    }

    try {
      setReviewError("");
      setReviewSuccess("");

      await createReview({
        albumId: id,
        albumName: album.name,
        artistName: album.artistName,
        artworkUrl: album.artworkUrl,
        rating,
        reviewText,
        mood,
        favoriteTrack,
      });

      setReviewSuccess("Review posted successfully.");
      setReviewText("");
      setMood("");
      setFavoriteTrack("");
      setRating(5);

      fetchReviews(id);
    } catch (err) {
      if (err instanceof Error) {
        setReviewError(err.message);
      } else {
        setReviewError("Could not post review.");
      }
    }
  }

  async function handleDiarySubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!album || !id) {
    setDiaryError("Album details not found. Go back and open the album again.");
    return;
  }

  const token = localStorage.getItem("musicart_token");

  if (!token) {
    setDiaryError("Please login to add diary entries.");
    return;
  }

  try {
    setDiaryError("");
    setDiaryMessage("");

    await createDiaryEntry({
      albumId: id,
      albumName: album.name,
      artistName: album.artistName,
      artworkUrl: album.artworkUrl,
      listenedDate: diaryDate,
      mood: diaryMood,
      favoriteTrack: diaryFavoriteTrack,
      note: diaryNote,
      rating: diaryRating,
    });

    setDiaryMessage("Album added to your diary.");
    setDiaryMood("");
    setDiaryFavoriteTrack("");
    setDiaryNote("");
    setDiaryRating(5);
  } catch (err) {
    if (err instanceof Error) {
      setDiaryError(err.message);
    } else {
      setDiaryError("Could not add diary entry.");
    }
  }
}
  
  async function handleSaveAlbum() {
  if (!album || !id) {
    setFavoriteError("Album details not found.");
    return;
  }

  const token = localStorage.getItem("musicart_token");

  if (!token) {
    setFavoriteError("Please login to save albums.");
    return;
  }

  try {
    setFavoriteError("");
    setFavoriteMessage("");

    await addFavorite({
      albumId: id,
      albumName: album.name,
      artistName: album.artistName,
      artworkUrl: album.artworkUrl,
      genre: album.genre,
      albumUrl: album.albumUrl,
    });

    setFavoriteMessage("Album saved to your profile.");
  } catch (err) {
    if (err instanceof Error) {
      setFavoriteError(err.message);
    } else {
      setFavoriteError("Could not save album.");
    }
  }
}


  return (
    <>
      <NavBar />

      <main className="album-details-page">
        <Link to="/" className="back-link">
          ← Back to search
        </Link>

        {album && (
          <section className="album-hero-details">
            <img src={album.artworkUrl} alt={album.name} />

            <div>
              <h1>{album.name}</h1>
              <p>{album.artistName}</p>
              <p>{album.genre}</p>
              <p>
                {album.releaseDate
                  ? new Date(album.releaseDate).toLocaleDateString()
                  : "Unknown release date"}
              </p>

              <p>
                ⭐ {averageRating || "No ratings yet"} / 5 · {totalReviews} reviews
              </p>

              <a href={album.albumUrl} target="_blank" rel="noreferrer">
                Open in Apple Music
              </a>
              
              <button className="save-album-button" onClick={handleSaveAlbum}>
                Save Album
              </button>
              
              {favoriteMessage && <p className="review-success">{favoriteMessage}</p>}
              {favoriteError && <p className="auth-error">{favoriteError}</p>}

            </div>
          </section>
        )}

        <section className="album-details">
          <div className="track-list">
            <h2>Tracklist</h2>

            {loading && <p>Loading tracks...</p>}

            <ul>
              {tracks.map((track) => (
                <li key={track.id}>
                  <div className="track-info">
                    <span>
                      {track.trackNumber}. {track.name}
                    </span>
                    <span>{formatDuration(track.durationMs)}</span>
                  </div>

                  {track.previewUrl && (
                    <audio controls src={track.previewUrl}>
                      Your browser does not support audio.
                    </audio>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="review-form-card">
            <h2>Write a Review</h2>

            {reviewError && <p className="auth-error">{reviewError}</p>}
            {reviewSuccess && <p className="review-success">{reviewSuccess}</p>}

            <form onSubmit={handleReviewSubmit}>
              <label>Rating</label>
              <select
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
              >
                <option value={5}>5 - Masterpiece</option>
                <option value={4.5}>4.5</option>
                <option value={4}>4 - Great</option>
                <option value={3.5}>3.5</option>
                <option value={3}>3 - Good</option>
                <option value={2.5}>2.5</option>
                <option value={2}>2 - Okay</option>
                <option value={1.5}>1.5</option>
                <option value={1}>1 - Bad</option>
                <option value={0.5}>0.5</option>
              </select>

              <label>Review</label>
              <textarea
                placeholder="What did you think about this album?"
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
              />

              <label>Mood</label>
              <input
                type="text"
                placeholder="e.g. nostalgic, hype, sad, chill"
                value={mood}
                onChange={(event) => setMood(event.target.value)}
              />

              <label>Favorite Track</label>
              <input
                type="text"
                placeholder="Your favorite song from this album"
                value={favoriteTrack}
                onChange={(event) => setFavoriteTrack(event.target.value)}
              />

              <button type="submit">Post Review</button>
            </form>
          </div>

          <div className="review-form-card">
  <h2>Add to Diary</h2>

  {diaryError && <p className="auth-error">{diaryError}</p>}
  {diaryMessage && <p className="review-success">{diaryMessage}</p>}

  <form onSubmit={handleDiarySubmit}>
    <label>Listened Date</label>
    <input
      type="date"
      value={diaryDate}
      onChange={(event) => setDiaryDate(event.target.value)}
    />

    <label>Rating</label>
    <select
      value={diaryRating}
      onChange={(event) => setDiaryRating(Number(event.target.value))}
    >
      <option value={5}>5 - Masterpiece</option>
      <option value={4.5}>4.5</option>
      <option value={4}>4 - Great</option>
      <option value={3.5}>3.5</option>
      <option value={3}>3 - Good</option>
      <option value={2.5}>2.5</option>
      <option value={2}>2 - Okay</option>
      <option value={1.5}>1.5</option>
      <option value={1}>1 - Bad</option>
      <option value={0.5}>0.5</option>
    </select>

    <label>Mood</label>
    <input
      type="text"
      placeholder="e.g. nostalgic, chill, hype, sad"
      value={diaryMood}
      onChange={(event) => setDiaryMood(event.target.value)}
    />

    <label>Favorite Track</label>
    <input
      type="text"
      placeholder="Your favorite song from this album"
      value={diaryFavoriteTrack}
      onChange={(event) => setDiaryFavoriteTrack(event.target.value)}
    />

    <label>Private Note</label>
    <textarea
      placeholder="How did this album feel today?"
      value={diaryNote}
      onChange={(event) => setDiaryNote(event.target.value)}
    />

    <button type="submit">Add to Diary</button>
  </form>
</div>

          <div className="reviews-list">
            <h2>Reviews</h2>

            {reviews.length === 0 && <p>No reviews yet. Be the first.</p>}

            {reviews.map((review) => (
              <div className="review-item" key={review._id}>
                <h3>{review.user.username}</h3>
                <p>⭐ {review.rating}/5</p>
                <p>{review.reviewText}</p>

                {review.mood && <p>Mood: {review.mood}</p>}
                {review.favoriteTrack && (
                  <p>Favorite track: {review.favoriteTrack}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default AlbumDetails;