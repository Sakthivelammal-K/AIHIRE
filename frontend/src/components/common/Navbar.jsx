import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";

function Navbar() {

  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo">
        <h2 onClick={() => navigate("/")}>AIHIRE</h2>
      </div>

      <ul className="nav-menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/features">Features</Link></li>
        <li><Link to="/pricing">Pricing</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      <div className="nav-buttons">

        <Link
          to="/login"
          className="nav-login-btn"
          >
          Login
        </Link>

        <Link
            to="/register"
            className="nav-start-btn"
          >
          Get Started
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;