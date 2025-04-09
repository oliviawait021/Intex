import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-container">
      {/* Left: Logo */}
      <div className="footer-logo">
        <img
          src="/images/logo.png"
          alt="CineNiche Logo"
          className="footer-logo-img"
        />
      </div>

      {/* Center: Links */}
      <div className="footer-links">
        <Link to="/privacy" className="faq-link">
          Privacy Policy
        </Link>
      </div>

      {/* Right: Copyright */}
      <div className="footer-copy">
        © {new Date().getFullYear()} CineNiche. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
