import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import Navbar from "../components/Navbar";

export default function VotingSuccess() {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const messageRef = useRef(null);
  const containerRef = useRef(null);

  const selectedCandidateStr = localStorage.getItem("selectedCandidate");
  const candidate = selectedCandidateStr ? JSON.parse(selectedCandidateStr) : null;

  // Debug: Log data untuk memastikan tersimpan
  useEffect(() => {
    console.log("VotingSuccess - Candidate data:", candidate);
    console.log("VotingSuccess - LocalStorage selectedCandidate:", selectedCandidateStr);
  }, [candidate, selectedCandidateStr]);

  // GSAP animations
  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      ".success-photo-section",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "back.out" }
    );
  }, []);

  // After 5 seconds, show message and auto scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
      setTimeout(() => {
        if (messageRef.current) {
          messageRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);

      // GSAP animation untuk message
      gsap.fromTo(
        ".success-message-section",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
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
    <div className="voting-success-page" ref={containerRef}>
      <Navbar />
      
      {!candidate ? (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <h2>Data tidak ditemukan</h2>
          <p>Silakan kembali ke halaman sebelumnya</p>
          <button onClick={() => navigate("/")} className="btn-back-home">
            ← Kembali ke Beranda
          </button>
        </div>
      ) : (
        <div className="success-container">
          {/* Photo Section - Left on Desktop */}
          <motion.div
            className="success-photo-section"
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          >
            <div className="photo-container">
              {/* Photo animation - bouncy effect with fire emojis behind */}
              <div className="fire-emoji-container">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="fire-emoji"
                    animate={{
                      y: [0, -100, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                    style={{
                      left: `${(i * 360) / 8}deg`,
                    }}
                  >
                    🔥
                  </motion.div>
                ))}
              </div>

              {/* Photo with bouncy animation */}
              <motion.img
                src={candidate?.foto}
                alt={candidate?.nama}
                className="success-photo"
                animate={{ 
                  scale: [1, 1.1, 0.95, 1.05, 1],
                  y: [0, -20, 10, -5, 0]
                }}
                transition={{ 
                  duration: 5, 
                  times: [0, 0.2, 0.4, 0.7, 1],
                  ease: "easeInOut"
                }}
                onError={(e) => {
                  console.error("Image failed to load:", e);
                  e.target.src = "/paslon/paslon-1.png"; // Fallback image
                }}
              />
              
              {/* Checkmark badge */}
              <motion.div
                className="paslon-checkmark"
                animate={{ scale: [1, 1.1, 0.95, 1.05, 1] }}
                transition={{ 
                  duration: 5, 
                  times: [0, 0.2, 0.4, 0.7, 1],
                  ease: "easeInOut"
                }}
              >
                ✓
              </motion.div>
            </div>
          </motion.div>

          {/* Message Section - Right on Desktop */}
          <motion.div
            ref={messageRef}
            className="success-message-section"
            initial={{ opacity: 0, y: 20 }}
            animate={showMessage ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          >
            <h2>Pilihanmu Disimpan</h2>
            <p className="candidate-name">{candidate?.nama}</p>
            <p className="candidate-paslon">Paslon #{candidate?.nomor}</p>

            <div className="countdown-display">
              <span className="countdown-number">{timeLeft}</span>
              <span className="countdown-text">detik</span>
            </div>

            <button
              className="btn-back-home"
              onClick={() => navigate("/")}
            >
              ← Kembali ke Beranda
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
