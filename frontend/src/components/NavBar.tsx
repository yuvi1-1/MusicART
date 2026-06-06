import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("musicart_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  function handleLogout() {
    localStorage.removeItem("musicart_token");
    localStorage.removeItem("musicart_user");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">🎵 MusicART</Link>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <a href="/#discover">Discover</a>
        </li>

        <li>
          <a href="/#reviews">Reviews</a>
        </li>

        <li>
          <a href="/#community">Community</a>
        </li>

        {user ? (
          <>
            <li>
              <span className="nav-user">Hi, {user.username}</span>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <button className="nav-logout" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="btn-login">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="btn-login">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;