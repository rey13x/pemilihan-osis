import { useState, useEffect, useRef } from "react";
import illustration from "../assets/illustration.png";
import smk2Logo from "../assets/smk2.png";
import Counter from "./Counter";


export default function Hero() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isJurusanDragging, setIsJurusanDragging] = useState(false);
  const [jurusanDragStart, setJurusanDragStart] = useState(0);
  const autoFlipRef = useRef(null);
  const jurusanTrackRef = useRef(null);
  const jurusanDragStartRef = useRef(0);
  const jurusanCurrentTranslateRef = useRef(0);

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

  /* ===============================
     JURUSAN MARQUEE - DRAG & SWIPE
  =============================== */
  const handleJurusanMouseDown = (e) => {
    setIsJurusanDragging(true);
    jurusanDragStartRef.current = e.clientX;
    if (jurusanTrackRef.current) {
      jurusanTrackRef.current.style.animationPlayState = "paused";
    }
  };

  const handleJurusanTouchStart = (e) => {
    setIsJurusanDragging(true);
    jurusanDragStartRef.current = e.touches[0].clientX;
    if (jurusanTrackRef.current) {
      jurusanTrackRef.current.style.animationPlayState = "paused";
    }
  };

  const handleJurusanMouseMove = (e) => {
    if (!isJurusanDragging || !jurusanTrackRef.current) return;

    const diff = e.clientX - jurusanDragStartRef.current;
    const currentTranslate = jurusanCurrentTranslateRef.current + diff;

    jurusanTrackRef.current.style.transform = `translateX(${currentTranslate}px)`;
  };

  const handleJurusanTouchMove = (e) => {
    if (!isJurusanDragging || !jurusanTrackRef.current) return;

    const diff = e.touches[0].clientX - jurusanDragStartRef.current;
    const currentTranslate = jurusanCurrentTranslateRef.current + diff;

    jurusanTrackRef.current.style.transform = `translateX(${currentTranslate}px)`;
  };

  const handleJurusanMouseUp = (e) => {
    if (!isJurusanDragging || !jurusanTrackRef.current) return;

    const diff = e.clientX - jurusanDragStartRef.current;
    jurusanCurrentTranslateRef.current += diff;

    setIsJurusanDragging(false);
    jurusanTrackRef.current.style.animationPlayState = "running";
  };

  const handleJurusanTouchEnd = (e) => {
    if (!isJurusanDragging || !jurusanTrackRef.current) return;

    const diff = e.changedTouches[0].clientX - jurusanDragStartRef.current;
    jurusanCurrentTranslateRef.current += diff;

    setIsJurusanDragging(false);
    jurusanTrackRef.current.style.animationPlayState = "running";
  };

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
            <div
              className="jurusan-strip"
              onMouseDown={handleJurusanMouseDown}
              onMouseMove={handleJurusanMouseMove}
              onMouseUp={handleJurusanMouseUp}
              onMouseLeave={handleJurusanMouseUp}
              onTouchStart={handleJurusanTouchStart}
              onTouchMove={handleJurusanTouchMove}
              onTouchEnd={handleJurusanTouchEnd}
              style={{ userSelect: "none", cursor: isJurusanDragging ? "grabbing" : "grab" }}
            >
              <div className="jurusan-track" ref={jurusanTrackRef}>
                {[...jurusanLogos, ...jurusanLogos, ...jurusanLogos].map((j, i) => (
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

            {/* ===== VIDEO/PHOTO ===== */}
            <div className="hero-video">
              <img 
                src="/paslon/formal-osis.jpg" 
                alt="Formal OSIS" 
                className="hero-video-image"
              />
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
