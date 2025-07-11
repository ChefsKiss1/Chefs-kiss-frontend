import { Link } from "react-router-dom";


const Footer = () => (
  <footer className="footer">
    <div className="footer-links">
      <Link to="/contact">Contact Us</Link>
      <Link to="/about">About Us</Link>
    </div>
  </footer>
);

export default Footer;