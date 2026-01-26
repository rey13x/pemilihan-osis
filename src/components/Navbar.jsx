import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [clickCount, setClickCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Show navbar only on home page
  if (location.pathname !== "/") {
    return null;
  }

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Secret shortcut: 10 clicks = admin login form
    if (newCount === 10) {
      navigate("/dashboard-login");
      setClickCount(0); // reset counter
    }
  };

  const navItems = [
    { label: "Beranda", href: "#home" },
    { label: "3 Cara", href: "#cara" },
    { label: "Pilih Osis", href: "#osis" },
    { label: "Pilih Paslon", href: "#paslon" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="logo-stack" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
          <span className="logo-top">Pilih</span>
          <span className="logo-bottom">Osis</span>
        </div>

        <div className="navbar-spacer"></div>

        {/* Desktop Navigation */}
        <div className="navbar-menu">
          {navItems.map((item, idx) => (
            <a key={idx} href={item.href} className="navbar-item">
              {item.label}
            </a>
          ))}
        </div>

        {/* Hamburger Button for Mobile */}
        <button 
          className="hamburger-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="navbar-mobile-menu">
          {navItems.map((item, idx) => (
            <a 
              key={idx} 
              href={item.href} 
              className="mobile-menu-item"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

Navbar.displayName = "Navbar";
