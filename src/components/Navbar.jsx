import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Countdown from "./Countdown";

export default function Navbar() {
  const [clickCount, setClickCount] = useState(0);
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

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="logo-stack" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
          <span className="logo-top">Pilih</span>
          <span className="logo-bottom">Osis</span>
        </div>

        <div className="navbar-spacer"></div>

        <div className="quiz-btn">
          <Countdown />
        </div>
      </div>
    </nav>
  );
}

Navbar.displayName = "Navbar";
