import { useState, useEffect } from "react";
import Counter from "./Counter";
import illustration from "../assets/illustration.png";
import smk2Logo from "../assets/smk2.png";

export default function Hero() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePopupToggle = () => {
    setIsPopupOpen((prev) => !prev);
  };

  const handleFlipToggle = () => {
    setIsFlipped((prev) => !prev);
  };

  /* =========================================
     LOCK BODY + FIX POPUP DESKTOP & MOBILE
  ========================================= */
  useEffect(() => {
    if (isPopupOpen) {
      document.body.classList.add("popup-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("popup-open");
      document.body.style.overflow = "";
    }

    return () => {
      document.body.classList.remove("popup-open");
      document.body.style.overflow = "";
    };
  }, [isPopupOpen]);

  return (
    <section className="hero">
      {/* ================= HERO UTAMA ================= */}
      <div className="hero-grid container">
        {/* KIRI - LOGO FLIP */}
        <div className="hero-left">
          <div
            className={`logo-flip ${isFlipped ? "is-flipped" : ""}`}
            onClick={handleFlipToggle}
          >
            <div className="logo-flip-inner">
              {/* DEPAN */}
              <img
                src={illustration}
                alt="Logo OSIS"
                className="logo-face logo-front"
              />

              {/* BELAKANG */}
              <img
                src={smk2Logo}
                alt="Logo SMKN 2"
                className="logo-face logo-back"
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

      {/* ================= CARD DESKRIPSI ================= */}
      <div className="hero-card container">
        <div className="hero-card-inner">
          <div className="card-logo-stack">
            <span className="card-logo-top">Pilih</span>
            <span className="card-logo-bottom">Osis</span>
          </div>

          <div className="card-text">
            <p className="card-title">
              Berperan dalam memilih untuk membawa perubahan positif sekolah.
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

            <button
              className="popup-close"
              onClick={handlePopupToggle}
            >
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

      {/* ================= CARD STEPS ================= */}
      <div className="steps-card-section container">
        <div className="steps-card-grid">
          <div className="steps-card">
            <div className="steps-number">1</div>
            <img
              src={illustration}
              alt="Pahami isu"
              className="steps-image"
            />
            <h3>Pahami isu</h3>
            <p>
              Mulai dengan mencari tahu kebijakan dan masalah yang paling dekat
              dengan kehidupan sekolahmu.
            </p>
          </div>

          <div className="steps-card">
            <div className="steps-number">2</div>
            <img
              src={illustration}
              alt="Kenali calon"
              className="steps-image"
            />
            <h3>Kenali calon</h3>
            <p>
              Pelajari visi, misi, dan program kerja calon ketua OSIS sebelum
              menentukan pilihan.
            </p>
          </div>

          <div className="steps-card">
            <div className="steps-number">3</div>
            <img
              src={illustration}
              alt="Gunakan hak pilih"
              className="steps-image"
            />
            <h3>Gunakan hak pilih</h3>
            <p>
              Datang ke tempat pemilihan dan gunakan suaramu dengan bijak untuk
              masa depan sekolah.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
