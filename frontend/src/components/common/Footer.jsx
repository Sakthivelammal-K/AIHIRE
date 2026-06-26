import { Link } from "react-router-dom";
import "../../styles/footer.css";
import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
          <div className="footer-brand">

            <h2>AIHIRE</h2>

            <p>
            AI-powered hiring platform helping
            recruiters discover, evaluate and hire
            top talent faster.
            </p>

<div className="social-links">

  <a href="#" aria-label="LinkedIn">
    <FaLinkedin />
  </a>

  <a href="#" aria-label="Instagram">
    <FaInstagram />
  </a>

  <a href="#" aria-label="Facebook">
    <FaFacebook />
  </a>

  <a href="#" aria-label="Twitter">
    <FaXTwitter />
  </a>

</div>
        </div>

        {/* Product */}
        <div className="footer-links">

          <h3>Product</h3>

          <Link to="/">Home</Link>
          <Link to="/register">Get Started</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/login">Login</Link>

        </div>

        {/* Company */}
        <div className="footer-links">

          <h3>Company</h3>

          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/careers">Careers</Link>

        </div>

        {/* Support */}
        <div className="footer-links">

          <h3>Support</h3>

          <a href="mailto:support@aihire.com">
            support@aihire.com
          </a>

          <a href="/">Help Center</a>

          <a href="/">Privacy Policy</a>

          <a href="/">Terms of Service</a>

        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © 2026 AIHIRE. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;