import { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import AlbumCard from "../components/AlbumCard";
import { searchAlbums } from "../services/musicServices";
import type { Album } from "../types/music";

function Home() {
  const [query, setQuery] = useState("");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchAlbums(searchQuery: string) {
    try {
      setLoading(true);
      setError("");

      const data = await searchAlbums(searchQuery);
      setAlbums(data);
    } catch (err) {
      console.error(err);
      setError("Could not fetch albums. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    fetchAlbums(query);

    setTimeout(() => {
      document.getElementById("discover")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 200);
  }

  return (
    <>
      <NavBar />

      <header className="hero" id="home">
        <div className="hero-content">
          <h1>Discover the Art of Music</h1>
          <p>Explore, review, and share your favorite music albums and artists.</p>

          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              id="search-bar"
              placeholder="Search for albums or artists..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>

          <a href="#discover" className="cta-button">
            Get Started
          </a>
        </div>
      </header>

      <section className="featured-albums" id="discover">
        <h2>Discover Albums</h2>

        {loading && <p>Loading albums...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && albums.length === 0 && (
          <p>Search for an artist or album to see results.</p>
        )}

        <div className="album-grid">
          {!loading &&
            albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
        </div>
      </section>

      <section className="reviews" id="reviews">
        <h2>What People Are Saying</h2>
        <p>Reviews section coming soon.</p>
      </section>

      <section className="community" id="community">
        <h2>Join Our Community</h2>
        <p>Connect with music lovers and share your favorite albums.</p>
      </section>

      <Footer />
    </>
  );
}

export default Home;