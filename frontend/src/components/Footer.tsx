import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-container">
      {/* Left: Links */}
      <div className="footer-logo">
        <Link to="/privacy" className="faq-link">
          Privacy Policy
        </Link>
      </div>
      
      
      {/* Center: Logo */}
      <div className="footer-links">
        <img
          src="/images/logo.png"
          alt="CineNiche Logo"
          className="footer-logo-img"
        />
      </div>

      {/* Right: Copyright */}
      <div className="footer-copy">
        © {new Date().getFullYear()} CineNiche. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
