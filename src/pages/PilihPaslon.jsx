import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import NotificationPopup from "../components/NotificationPopup";
import Navbar from "../components/Navbar";
import { db } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

const ConfirmationPopup = ({ isOpen, onConfirm, onCancel, selectedName }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="confirmation-overlay"
      onClick={onCancel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="confirmation-popup"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button className="confirmation-close" onClick={onCancel}>
          ✕
        </button>

        <h2>Sudah yakin dengan pilihanmu?</h2>
        <p className="selected-name">{selectedName}</p>

        <div className="confirmation-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            Batalkan
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            YA!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function PilihPaslon() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [expandedPaslon, setExpandedPaslon] = useState(null);
  const [selectedPaslon, setSelectedPaslon] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    type: "error",
    message: "",
  });

  const kandidatList = [
    {
      id: "paslon1",
      nomor: "1",
      nama: "Anies Baswedan",
      wakil: "Muhaimin Iskandar",
      foto: "/paslon/paslon-1.png",
      tagline: "Indonesia Adil Makmur untuk Semua",
      partai: "Non-partai",
    },
    {
      id: "paslon2",
      nomor: "2",
      nama: "Prabowo Subianto",
      wakil: "Gibran Rakabuming",
      foto: "/paslon/paslon-2.png",
      tagline: "Bersama Indonesia Maju Menuju Indonesia Emas 2045",
      partai: "Gerindra",
    },
    {
      id: "paslon3",
      nomor: "3",
      nama: "Ganjar Pranowo",
      wakil: "Mahfud MD",
      foto: "/paslon/paslon-3.png",
      tagline: "Gerak Cepat Menuju Indonesia Unggul",
      partai: "PDIP",
    },
    {
      id: "paslon4",
      nomor: "4",
      nama: "Hari Poernomo",
      wakil: "Sjaiful Bahri",
      foto: "/paslon/paslon-4.png",
      tagline: "Indonesia Bangkit untuk Semua Rakyat",
      partai: "Non-partai",
    },
  ];

  const handleConfirm = async () => {
    if (!selectedPaslon) {
      setNotification({
        isOpen: true,
        type: "error",
        message: "Pilih paslon terlebih dahulu",
      });
      return;
    }

    setIsConfirmOpen(false);

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const userRef = doc(db, "users", currentUser.nis);

      await updateDoc(userRef, {
        sudahVote: true,
        vote: selectedPaslon,
        kelas: currentUser.kelas,
        jurusan: currentUser.jurusan,
        votedAt: new Date(),
      });

      // Simpan selected paslon untuk halaman success
      localStorage.setItem("selectedVote", selectedPaslon);

      setNotification({
        isOpen: true,
        type: "success",
        message: "Vote berhasil!",
      });

      setTimeout(() => {
        navigate("/voting-success");
      }, 1500);
    } catch (err) {
      console.error("Error voting:", err);
      setNotification({
        isOpen: true,
        type: "error",
        message: "Gagal menyimpan vote",
      });
    }
  };

  const selectedCandidate = kandidatList.find((k) => k.id === selectedPaslon);

  return (
    <div className="pilih-paslon-gallery">
      <Navbar />
      <button className="back-button" onClick={() => navigate("/simulasi")}>
        ← Kembali
      </button>
      <NotificationPopup
        isOpen={notification.isOpen}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isOpen: false })}
      />

      <ConfirmationPopup
        isOpen={isConfirmOpen}
        onConfirm={handleConfirm}
        onCancel={() => setIsConfirmOpen(false)}
        selectedName={selectedCandidate?.nama}
      />

      {/* Header */}
      <motion.div
        className="gallery-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Pilih Paslon Pilihanmu</h1>
        <p>Klik kartu untuk memilih</p>
      </motion.div>

      {/* Gallery */}
      <div className="gallery-container" ref={containerRef}>
        <nav className="gallery-nav">
          {kandidatList.map((kandidat, index) => (
            <motion.div
              key={kandidat.id}
              className={`gallery-card ${expandedPaslon === kandidat.id ? "expanded" : ""} ${selectedPaslon === kandidat.id ? "selected" : ""}`}
              onClick={() => {
                if (expandedPaslon === kandidat.id) {
                  // Second click: confirm selection
                  setSelectedPaslon(kandidat.id);
                  setIsConfirmOpen(true);
                } else {
                  // First click: expand
                  setExpandedPaslon(kandidat.id);
                }
              }}
              animate={{
                flex: expandedPaslon === kandidat.id ? 3 : 1,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="card-image">
                <img src={kandidat.foto} alt={kandidat.nama} loading="lazy" />
              </div>

              <AnimatePresence>
                {expandedPaslon === kandidat.id && (
                  <motion.div
                    className="card-info"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="card-number" onClick={(e) => e.stopPropagation()}>{kandidat.nomor}</div>
                    <h2 onClick={(e) => e.stopPropagation()}>{kandidat.nama}</h2>
                    <p className="card-wakil" onClick={(e) => e.stopPropagation()}>{kandidat.wakil}</p>
                    <p className="card-tagline" onClick={(e) => e.stopPropagation()}>{kandidat.tagline}</p>
                    <p className="card-partai" onClick={(e) => e.stopPropagation()}>{kandidat.partai}</p>

                    <motion.button
                      className="card-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPaslon(kandidat.id);
                        setIsConfirmOpen(true);
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                    >
                      PILIH!
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <motion.div
        className="gallery-footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {selectedPaslon ? (
          <div className="selected-display">
            <img src={selectedCandidate?.foto} alt={selectedCandidate?.nama} className="selected-photo" />
            <p>Pilihan kamu: <strong>{selectedCandidate?.nama}</strong></p>
          </div>
        ) : expandedPaslon ? (
          <p>Klik 2x untuk memilih paslon</p>
        ) : (
          <p>Klik kartu untuk membuka detail paslon</p>
        )}
      </motion.div>
    </div>
  );
}
