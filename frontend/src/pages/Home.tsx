import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <NavBar />

      <header className="hero" id="home">
        <div className="hero-content">
          <h1>Discover the Art of Music</h1>
          <p>Explore, review, and share your favorite music albums and artists.</p>

          <div className="search-bar">
            <input
              type="text"
              id="search-bar"
              placeholder="Search for albums or artists..."
            />
            <button id="search-button">Search</button>
          </div>

          <a href="#discover" className="cta-button">
            Get Started
          </a>
        </div>
      </header>

      <section className="featured-albums" id="discover">
        <h2>Featured Albums</h2>
        <div className="album-grid">
          <p>Albums will appear here...</p>
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