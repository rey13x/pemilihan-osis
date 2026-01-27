import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function VotingSuccess() {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const containerRef = useRef(null);
  const audioContextRef = useRef(null);

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

  // Play sound effects
  const playBeep = (frequency = 800, duration = 100) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.value = frequency;
    osc.type = "sine";
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000);
  };

  // Jreg sound on mount
  useEffect(() => {
    playBeep(600, 80); // jreg sound
  }, []);

  // After 3 seconds, show message and auto scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
      playBeep(1000, 150); // kring sound
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }, 3000);

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
        initial={{ opacity: 0, scale: 2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <div className="photo-container">
          {/* Photo animation only on entry */}
          <motion.img
            src={candidate?.foto}
            alt={candidate?.nama}
            className="success-photo"
            animate={{ scale: [1.2, 0.9, 1, 0.95, 1.05, 1] }}
            transition={{ 
              duration: 3, 
              times: [0, 0.3, 0.5, 0.7, 0.85, 1],
              ease: "easeInOut"
            }}
          />
          
          {/* Number badge with animation only on entry */}
          <motion.div
            className="paslon-number"
            animate={{ scale: [1.2, 0.9, 1, 0.95, 1.05, 1] }}
            transition={{ 
              duration: 3, 
              times: [0, 0.3, 0.5, 0.7, 0.85, 1],
              ease: "easeInOut"
            }}
          >
          </motion.div>
        </div>
      </motion.div>

      {/* Message Section */}
      <motion.div
        ref={containerRef}
        className="success-message-section"
        initial={{ opacity: 0, y: 20 }}
        animate={showMessage ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <h2>Yeay! Pilihanmu Tersimpan</h2>
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
