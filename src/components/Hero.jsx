import { useState } from "react";
import Counter from "./Counter";
import illustration from "../assets/illustration.png";
import smk2Logo from "../assets/smk2.png";

export default function Hero() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handlePopupToggle = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <section className="hero">
      {/* ================= HERO UTAMA ================= */}
      <div className="hero-grid container">
        {/* KIRI - LOGO FLIP */}
        <div className="hero-left">
          <div className="logo-flip">
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
              Sebagai bagian dari komunitas sekolah, kita semua berperan dalam
              memilih untuk membawa perubahan positif sekolah.
            </p>

            <p className="card-desc">
              Website ini menyediakan informasi tentang calon ketua OSIS dan
              program kerja mereka.{" "}
              <span style={{ color: "green" }}>
                Bekerja sama dengan siswa jurusan Rekayasa Perangkat Lunak
              </span>{" "}
              yang turut membangun website ini. Jika ada masalah, segera melapor
              melalui{" "}
              <span
                onClick={handlePopupToggle}
                style={{ color: "blue", cursor: "pointer" }}
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
        <div className="popup">
          <div className="popup-content">
            <h3>Pilih Lapor</h3>
            <ul>
              <li>
                <a
                  href="https://instagram.com/osissmkn2bekasi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Osissmkn2bekasi
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/13bagas.exv"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @13bagas.exv
                </a>
              </li>
            </ul>
            <button onClick={handlePopupToggle}>Tutup</button>
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
          {/* CARD 1 */}
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

          {/* CARD 2 */}
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

          {/* CARD 3 */}
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
