import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function VotingSuccess() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(15);
  const [isFlipped, setIsFlipped] = useState(false);
  const scrollContainerRef = useRef(null);

  const kandidatList = [
    {
      id: "paslon1",
      nomor: "1",
      nama: "Anies Baswedan",
      wakil: "Muhaimin Iskandar",
      foto: "/paslon/paslon-1.png",
    },
    {
      id: "paslon2",
      nomor: "2",
      nama: "Prabowo Subianto",
      wakil: "Gibran Rakabuming",
      foto: "/paslon/paslon-2.png",
    },
    {
      id: "paslon3",
      nomor: "3",
      nama: "Ganjar Pranowo",
      wakil: "Mahfud MD",
      foto: "/paslon/paslon-3.png",
    },
    {
      id: "paslon4",
      nomor: "4",
      nama: "Hari Poernomo",
      wakil: "Sjaiful Bahri",
      foto: "/paslon/paslon-4.png",
    },
  ];

  const selectedPaslon = localStorage.getItem("selectedVote");
  const candidate = kandidatList.find((k) => k.id === selectedPaslon);

  // Handle flip animation loop
  useEffect(() => {
    const flipInterval = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 1200); // Flip setiap 1.2 detik

    return () => clearInterval(flipInterval);
  }, []);

  // Auto scroll setelah initial render
  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 4800); // Setelah 2x flip (2400ms) + delay buffer

    return () => clearTimeout(scrollTimer);
  }, []);

  // Countdown timer
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [navigate]);

  return (
    <div className="voting-success-page">
      <Navbar />
      
      <motion.div
        className="success-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* 3D Flip Card Animation */}
        <motion.div
          className="flip-card-wrapper"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="flip-card"
            animate={{ rotationY: isFlipped ? 180 : 0 }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* Front - Foto Paslon */}
            <motion.div
              className="flip-card-front"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div className="success-image-frame">
                <img 
                  src={candidate?.foto} 
                  alt={candidate?.nama}
                  className="success-image"
                />
                <div className="paslon-number-badge">{candidate?.nomor}</div>
              </div>
            </motion.div>

            {/* Back - Logo OSIS */}
            <motion.div
              className="flip-card-back"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="osis-logo-display">
                <div className="osis-logo-large">
                  <span className="osis-top">Pilih</span>
                  <span className="osis-bottom">Osis</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Teks Pilihan Disimpan */}
        <motion.div
          className="success-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Pilihan Kamu Disimpan!</h2>
          <p className="selected-candidate">
            {candidate?.nama} & {candidate?.wakil}
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          className="success-countdown"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          ref={scrollContainerRef}
        >
          <p className="countdown-text">Dalam waktu</p>
          <div className="countdown-timer">
            <motion.span
              key={timeLeft}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="countdown-number"
            >
              {timeLeft}
            </motion.span>
            <span className="countdown-label">detik</span>
          </div>
          <p className="countdown-text">Kamu akan kembali ke halaman utama</p>
        </motion.div>

        {/* Manual Back Button */}
        <motion.button
          className="success-back-btn"
          onClick={() => navigate("/")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Kembali ke Halaman Utama
        </motion.button>
      </motion.div>
    </div>
  );
}
