import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import Navbar from "../components/Navbar";

export default function Simulasi() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication and existing photo
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setIsAuthenticated(true);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // GSAP Animations
  useEffect(() => {
    if (!containerRef.current) return;

    // Animate hero title
    gsap.fromTo(
      ".simulasi-hero h1",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }
    );

    // Animate hero text
    gsap.fromTo(
      ".simulasi-hero p",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
      }
    );

    // Animate card
    gsap.fromTo(
      ".simulasi-card",
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 0.4,
        ease: "back.out",
      }
    );

    // Pulse animation on button
    gsap.to(".simulasi-start-btn", {
      boxShadow: [
        "0 0 0 0 rgba(191, 132, 29, 0.7)",
        "0 0 0 20px rgba(191, 132, 29, 0)",
      ],
      duration: 2,
      repeat: -1,
      ease: "power1.inOut",
    });
  }, []);

  const handleStartVoting = () => {
    // Navigate to pilih paslon page
    navigate("/pilih-paslon");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="simulasi-page" ref={containerRef}>
        {/* Hero Section */}
        <section className="simulasi-hero">
          <button
            className="back-btn"
            onClick={() => navigate("/")}
            style={{ marginBottom: "20px" }}
          >
            ← Kembali
          </button>

          <h1>Sudah Siap Voting?</h1>
          <p>Berikut adalah langkah-langkah yang perlu kamu lakukan untuk berpartisipasi dalam pemilihan OSIS.</p>
        </section>

        {/* Info Card Section */}
        <section className="simulasi-content">
          <div className="simulasi-image-info-section">
            <div className="simulasi-card">
              <div className="simulasi-icon-group">
                <span className="simulasi-main-icon">😎</span>
              </div>
              <p>Yakin dengan Pilihanmu yuks klik Mulai Voting!</p>
              <button
                className="simulasi-start-btn"
                onClick={handleStartVoting}
                ref={buttonRef}
              >
                Mulai Voting
              </button>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="simulasi-steps-section">
          <h2>Langkah-Langkah Voting:</h2>
          <div className="simulasi-steps">
            <motion.div
              className="step-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              viewport={{ once: true }}
            >
              <div className="step-number">1</div>
              <h3>Kenali Paslon</h3>
              <p>Pelajari visi, misi, dan program kerja setiap paslon OSIS</p>
            </motion.div>

            <motion.div
              className="step-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="step-number">2</div>
              <h3>Pilih Paslon</h3>
              <p>Pilih paslon yang paling sesuai dengan visi dan impianmu</p>
            </motion.div>

            <motion.div
              className="step-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="step-number">3</div>
              <h3>Konfirmasi Voting</h3>
              <p>Pastikan pilihan kamu dan tekan tombol Yakin!</p>
            </motion.div>

            <motion.div
              className="step-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="step-number">4</div>
              <h3>Selesai!</h3>
              <p>Voting kamu berhasil disimpan. Terima kasih telah berpartisipasi!</p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
