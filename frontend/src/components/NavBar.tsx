function NavBar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <span>🎵 MusicART</span>
      </div>

      <ul className="nav-links">
        <li>
          <a href="#home">Home</a>
        </li>
        <li>
          <a href="#discover">Discover</a>
        </li>
        <li>
          <a href="#reviews">Reviews</a>
        </li>
        <li>
          <a href="#community">Community</a>
        </li>
        <li>
          <a href="#login" className="btn-login">
            Login
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;