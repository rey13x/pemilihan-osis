import { useState, useEffect, useRef } from "react";
import Counter from "./Counter";
import illustration from "../assets/illustration.png";
import smk2Logo from "../assets/smk2.png";

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

/* =========================================
   AUTO FLIP LOGO OSIS
   - TUNGGU 8 DETIK
   - FLIP 1x
   - LOOP SETIAP 10 DETIK
========================================= */
useEffect(() => {
  const startAutoFlip = () => {
    autoFlipRef.current = setInterval(() => {
      setIsFlipped(true);
      setTimeout(() => setIsFlipped(false), 1000);
    }, 10000);
  };

  // tunggu 8 detik baru flip pertama
  const delay = setTimeout(() => {
    setIsFlipped(true);
    setTimeout(() => setIsFlipped(false), 1000);
    startAutoFlip();
  }, 6000);

  return () => {
    clearTimeout(delay);
    clearInterval(autoFlipRef.current);
  };
}, []);

  /* =========================================
     LOCK BODY SAAT POPUP
  ========================================= */
  useEffect(() => {
    document.body.style.overflow = isPopupOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isPopupOpen]);

  return (
    <section className="hero">
      {/* ================= HERO UTAMA ================= */}
      <div className="hero-grid container">
        {/* KIRI */}
        <div className="hero-left">
          <div
            className={`logo-flip ${isFlipped ? "is-flipped" : ""}`}
            onClick={handleFlipToggle}
          >
            <div className="logo-flip-inner">
              <img
                src={illustration}
                alt="Logo OSIS"
                className="logo-face logo-front"
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

        {/* KANAN */}
        <div className="hero-right">
          <Counter />

          <h1 className="hero-title">
            Pilihanmu Masa Depan{" "}
            <span className="word-slider">
              <span className="word-track">
                <span className="word">SMKN 2 KOTA BEKASI</span>
                <span className="word">OSKADUSI</span>
              </span>
            </span>
          </h1>
        </div>
      </div>

      {/* ================= HERO CARD ================= */}
      <div className="hero-card container">
        <div className="hero-card-inner">
          <div className="card-logo-stack">
            <span className="card-logo-top">Pilih</span>
            <span className="card-logo-bottom">Osis</span>
          </div>

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

      {/* ================= 3 CARA PILIH OSIS ================= */}
      <div className="steps-section container">
        <div className="steps-wrapper">
          <h2 className="steps-top">3 Cara Kamu</h2>
          <div className="steps-bottom">Pilih Osis</div>
        </div>
      </div>

      {/* ================= STEPS CARD ================= */}
      <div className="steps-card-section container">
        <div className="steps-card-grid">
          <div className="steps-card">
            <div className="steps-number">1</div>
            <img
              src="/steps/step-1.png"
              alt="Kenali Calon"
              className="steps-image"
              draggable="false"
            />
            <h3>Kenali Calon</h3>
            <p>
              Cermati visi, misi, dan program kerja calon OSIS sebelum
              menentukan pilihan.
            </p>
          </div>

          <div className="steps-card">
            <div className="steps-number">2</div>
            <img
              src="/steps/step-2.png"
              alt="Pilih Osis"
              className="steps-image"
              draggable="false"
            />
            <h3>Pilih Osis</h3>
            <p>
              Kunjungi Website Pilih Osis dan gunakan aksesmu dengan NIS.
            </p>
          </div>

          <div className="steps-card">
            <div className="steps-number">3</div>
            <img
              src="/steps/step-3.png"
              alt="Terpilih"
              className="steps-image"
              draggable="false"
            />
            <h3>Terpilih</h3>
            <p>
              Pilihanmu tersimpan dan menunggu waktu pengumuman hasil
              Pilih Osis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
