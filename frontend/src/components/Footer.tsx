import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <>
      <div className="faq-links">
        <Link to="/login" className="faq-link">
          Account
        </Link>
        <Link to="/privacy" className="faq-link">
          Privacy Policy
        </Link>
        <a href="#faq" className="faq-link">
          FAQ
        </a>
      </div>
    </>
  );
}

export default Footer;
