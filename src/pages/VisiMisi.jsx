import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function VisiMisi() {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(null);
  const scrollContainerRef = useRef(null);

  const pairData = [
    {
      id: "paslon1",
      nomor: "1",
      nama: "Paslon 1",
      wakil: "Shandyka Dhavid & Virgina Zanuba Khafsoh",
      foto: "/paslon/paslon-1.png",
      visiMisi: "SATU SUARA, SATU TUJUAN, BERSAMA 01, WUJUDKAN IMPIAN",
    },
    {
      id: "paslon2",
      nomor: "2",
      nama: "Paslon 2",
      wakil: "Aulia Najibah & Reza Rizki Pratama",
      foto: "/paslon/paslon-2.png",
      visiMisi: "Be Wise, We Lead You",
    },
    {
      id: "paslon3",
      nomor: "3",
      nama: "Paslon 3",
      wakil: "Fitri Ramadhani & Reefly Aprilian",
      foto: "/paslon/paslon-3.png",
      visiMisi: "tak banyak kata, tunjukkan aksi nyata, pilih nomor kosong tiga",
    },
    {
      id: "paslon4",
      nomor: "4",
      nama: "Paslon 4",
      wakil: "Rahmat Alfian & Muhamad Yusuf",
      foto: "/paslon/paslon-4.png",
      visiMisi: "Konsisten Dengan Satu Tujuan Membawa Perubahan dan Bergerak untuk Masa Depan",
    },
  ];

  const handleCardClick = (pair) => {
    setSelectedCard(pair.id);
    setTimeout(() => {
      navigate(`/visi-misi/${pair.nomor}`);
    }, 300);
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="visi-misi-page">
        {/* Back Button */}
        <button className="back-btn-visi-misi" onClick={() => navigate("/")}>← Kembali</button>

        {/* Header */}
        <motion.section
          className="visi-misi-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="visi-misi-subtitle">PASANGAN CALON</h1>
          <h2 className="visi-misi-title">Cermati Visi Misi Masa Depan Oskadusi 2026</h2>
        </motion.section>

        {/* Candidate Cards - Horizontal Scroll */}
        <div className="visi-misi-scroll-wrapper">
          <motion.section
            className="visi-misi-grid"
            ref={scrollContainerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {pairData.map((pair) => (
              <motion.div
                key={pair.id}
                className={`visi-misi-card ${selectedCard === pair.id ? "selected" : ""}`}
                whileHover={{ y: -8 }}
                onClick={() => handleCardClick(pair)}
              >
                <div className="visi-misi-card-image">
                  <img src={pair.foto} alt={pair.nama} />
                </div>
                <div className="visi-misi-card-content">
                  <h3>{pair.nama}</h3>
                  <p className="visi-misi-wakil">{pair.wakil}</p>
                  <p className="visi-misi-tagline">{pair.visiMisi}</p>
                </div>
              </motion.div>
            ))}
          </motion.section>

          {/* Scroll Arrows */}
          <div className="visi-misi-scroll-controls">
            <button 
              className="visi-misi-scroll-btn left" 
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              ← 
            </button>
            <button 
              className="visi-misi-scroll-btn right" 
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>

        {/* Footer */}
        <motion.section
          className="visi-misi-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p>Pengolahan Informasi diproses oleh:</p>
          <div className="visi-misi-logo">
            <img src="/illustration.png" alt="OSIS 2026" />
          </div>
        </motion.section>
      </div>
    </>
  );
}
