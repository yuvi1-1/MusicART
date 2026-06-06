import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { getAlbumTracks } from "../services/musicServices";
import type { Track } from "../types/music";

function AlbumDetails() {
  const { id } = useParams();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchTracks(albumId: string) {
    try {
      setLoading(true);
      setError("");

      const data = await getAlbumTracks(albumId);
      setTracks(data);
    } catch (err) {
      console.error(err);
      setError("Could not fetch album tracks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      fetchTracks(id);
    }
  }, [id]);

  function formatDuration(durationMs: number) {
    if (!durationMs) return "0:00";

    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  return (
    <>
      <NavBar />

      <main className="album-details-page">
        <Link to="/" className="back-link">
          ← Back to search
        </Link>

        <section className="album-details">
          <h1>Album Tracks</h1>

          {loading && <p>Loading tracks...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && tracks.length === 0 && (
            <p>No tracks found for this album.</p>
          )}

          <div className="track-list">
            <h2>Tracklist</h2>

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
        </section>
      </main>

      <Footer />
    </>
  );
}

export default AlbumDetails;