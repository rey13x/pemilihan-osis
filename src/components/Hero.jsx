import { useState, useEffect, useRef } from "react";
import illustration from "../assets/illustration.png";
import smk2Logo from "../assets/smk2.png";
import Counter from "./Counter";


export default function Hero() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const autoFlipRef = useRef(null);

  const jurusanLogos = ["RPL", "TKJ", "TEI", "TBSM", "AKL", "TET"];

  const handlePopupToggle = () => {
    setIsPopupOpen((prev) => !prev);
  };

  const handleFlipToggle = () => {
    setIsFlipped((prev) => !prev);
  };

  /* ===============================
     AUTO FLIP LOGO
  =============================== */
  useEffect(() => {
    const startLoop = () => {
      autoFlipRef.current = setInterval(() => {
        setIsFlipped(true);
        setTimeout(() => setIsFlipped(false), 1000);
      }, 10000);
    };

    const delay = setTimeout(() => {
      setIsFlipped(true);
      setTimeout(() => setIsFlipped(false), 1000);
      startLoop();
    }, 8000);

    return () => {
      clearTimeout(delay);
      clearInterval(autoFlipRef.current);
    };
  }, []);

  /* ===============================
     LOCK SCROLL SAAT POPUP
  =============================== */
  useEffect(() => {
    document.body.style.overflow = isPopupOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isPopupOpen]);

  return (
    <section className="hero">
      {/* ================= HERO ATAS ================= */}
      <div className="hero-grid container">
        {/* LEFT */}
        <div className="hero-left">
          <div
            className={`logo-flip ${isFlipped ? "is-flipped" : ""}`}
            onClick={handleFlipToggle}
          >
            <div className="logo-flip-inner">
              <img
                src={illustration}
                alt="Logo OSIS"
                className="logo-face"
                draggable="false"
              />
              <img
                src={smk2Logo}
                alt="Logo SMKN 2"
                className="logo-face logo-back"
                draggable="false"
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hero-right">
          {/* 🔥 COUNTER ANIMATED (0 → 2000 + shake + bounce) */}
          <Counter />

          <h1 className="hero-title">
            Pilihanmu Masa Depan <br />
            <div className="word-slider">
              <div className="word-track">
                <span className="word">SMKN 2 KOTA BEKASI</span>
                <span className="word">OSKADUSI</span>
              </div>
            </div>
          </h1>
        </div>
      </div>

      {/* ================= HERO CARD ================= */}
      <div className="hero-card container">
        <div className="hero-card-inner">
          <div className="card-text">
            {/* ===== MARQUEE JURUSAN ===== */}
            <div className="jurusan-strip">
              <div className="jurusan-track">
                {[...jurusanLogos, ...jurusanLogos].map((j, i) => (
                  <div className="jurusan-item" key={i}>
                    <img
                      src={`/jurusan/${j}.png`}
                      alt={j}
                      draggable="false"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ===== VIDEO ===== */}
            <div className="hero-video">
              <div className="hero-video-inner">
                <iframe
                  src="https://www.youtube.com/embed/TgIUYdV1TkY?autoplay=1&mute=1&controls=0&loop=1&playlist=TgIUYdV1TkY&playsinline=1&rel=0"
                  title="Video OSIS"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
              <div className="video-hint">Tap untuk aktifkan suara</div>
            </div>

            {/* ===== TEXT ===== */}
            <p className="card-title">
              Berperan dalam memilih untuk membawa perubahan positif.
            </p>

            <p className="card-desc">
              Jika ada masalah, segera melapor melalui{" "}
              <span
                onClick={handlePopupToggle}
                style={{
                  color: "#2563eb",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Instagram
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      {/* ================= POPUP INSTAGRAM ================= */}
      {isPopupOpen && (
        <div className="popup-overlay" onClick={handlePopupToggle}>
          <div
            className="popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Pilih Instagram</h3>

            <a
              href="https://instagram.com/osissmkn2bekasi"
              target="_blank"
              rel="noopener noreferrer"
              className="popup-link"
            >
              @osissmkn2bekasi
            </a>

            <a
              href="https://instagram.com/13bagas.exv"
              target="_blank"
              rel="noopener noreferrer"
              className="popup-link"
            >
              @13bagas.exv
            </a>

            <button className="popup-close" onClick={handlePopupToggle}>
              Tutup
            </button>
          </div>
        </div>
      )}
      
    </section>
  );
}
