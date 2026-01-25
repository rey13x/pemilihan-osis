import { useState, useEffect, useRef } from "react";
import Counter from "./Counter";
import illustration from "../assets/illustration.png";
import smk2Logo from "../assets/smk2.png";

export default function Hero() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const autoFlipRef = useRef(null);

  const jurusanLogos = ["RPL", "TKJ", "TEI", "TBSM", "AKL", "TET"];

  /* ===============================
     POPUP TOGGLE
  =============================== */
  const handlePopupToggle = () => {
    setIsPopupOpen((prev) => !prev);
  };

  /* ===============================
     MANUAL FLIP
  =============================== */
  const handleFlipToggle = () => {
    setIsFlipped((prev) => !prev);
  };

  /* ===============================
     AUTO FLIP LOGO
     - tunggu 8 detik
     - flip 1x
     - loop tiap 10 detik
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
      {/* ================= HERO UTAMA ================= */}
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
          <div className="card-text">
            {/* ===== MARQUEE ===== */}
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

              <div className="video-hint">
                Tap untuk aktifkan suara
              </div>
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

      {/* ================= STEPS ================= */}
      <div className="steps-section container">
        <div className="steps-wrapper">
          <h2 className="steps-top">3 Cara Kamu</h2>
          <div className="steps-bottom">Pilih Osis</div>
        </div>
      </div>

      <div className="steps-card-section container">
        <div className="steps-card-grid">
          <div className="steps-card">
            <div className="steps-number">1</div>
            <img src="/steps/step-1.png" className="steps-image" draggable="false" />
            <h3>Kenali Paslon</h3>
            <p>
              Cermati visi, misi, dan program kerja Paslon OSIS sebelum menentukan pilihan.
            </p>
          </div>

          <div className="steps-card">
            <div className="steps-number">2</div>
            <img src="/steps/step-2.png" className="steps-image" draggable="false" />
            <h3>Pilih Osis</h3>
            <p>
              Kunjungi Website Pilih Osis dan gunakan aksesmu dengan NIS.
            </p>
          </div>

          <div className="steps-card">
            <div className="steps-number">3</div>
            <img src="/steps/step-3.png" className="steps-image" draggable="false" />
            <h3>Terpilih</h3>
            <p>
              Pilihanmu tersimpan dan menunggu waktu pengumuman hasil Pilih Osis.
            </p>
          </div>
        </div>
      </div>

      {/* ================= SIMULASI PILIH OSIS ================= */}
<div className="simulasi-section container">
  <div className="simulasi-card">

    {/* TEKS */}
    <div className="simulasi-text">
      <h2>SIMULASI<br />PILIH OSIS!</h2>
      <button className="simulasi-btn">Gaskeun!</button>
    </div>

    {/* GAMBAR TUNGGAL */}
    <div className="simulasi-image-single">
      <img src="/simulasi/foto-2.png" alt="Simulasi Pilih OSIS" />
    </div>

  </div>
</div>


    </section>

    
  );
}
