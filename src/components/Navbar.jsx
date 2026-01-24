import Countdown from "./Countdown";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* LOGO DESKTOP ONLY */}
        <div className="logo-stack">
          <span className="logo-top">Pilih</span>
          <span className="logo-bottom">Osis</span>
        </div>

        {/* DISPLAY ONLY */}
        <div className="quiz-btn">
          <Countdown />
        </div>

      </div>
    </nav>
  );
}