import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function VotingSuccess() {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const containerRef = useRef(null);

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

  // After 5 seconds, show message and auto scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!showMessage) return;

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          navigate("/obrolan");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [showMessage, navigate]);

  return (
    <div className="voting-success-page">
      <Navbar />
      
      <motion.div
        className="success-photo-section"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.img
          src={candidate?.foto}
          alt={candidate?.nama}
          className="bouncy-photo"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Message Section */}
      <motion.div
        ref={containerRef}
        className="success-message-section"
        initial={{ opacity: 0, y: 20 }}
        animate={showMessage ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Pilihanmu Tersimpan!</h2>
        <p className="candidate-name">{candidate?.nama}</p>
        <p className="redirect-text">Kamu akan dialihkan ke halaman obrolan</p>

        <div className="countdown-display">
          <span className="countdown-number">{timeLeft}</span>
          <span className="countdown-text">detik</span>
        </div>
      </motion.div>
    </div>
  );
}
