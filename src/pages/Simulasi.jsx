import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Simulasi() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="simulasi-page">
      {/* Header */}
      <motion.section
        className="simulasi-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Kembali
        </button>

        <div className="simulasi-hero-text">
          <h1>WAIT!!</h1>
        </div>
      </motion.section>

      {/* Image Section */}
      <motion.div
        className="simulasi-image-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <img src="/paslon/together-paslon.png" alt="Together" className="simulasi-together-image" />
      </motion.div>

      {/* Content */}
      <motion.section
        className="simulasi-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="content-card">
          <h2>Catatan Penting</h2>
          <ul>
            <li>Setiap pemilih hanya dapat memilih satu kali</li>
            <li>Pilihan kamu bersifat rahasia dan aman</li>
            <li>Hasil Voting akan ditampilkan pada waktu yang sudah ditentukan</li>
          </ul>
        </div>
      </motion.section>

      {/* Button */}
      <motion.div
        className="simulasi-footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <button className="simulasi-btn" onClick={() => navigate("/pilih-paslon")}>
          Mulai Voting!
        </button>
      </motion.div>
      </div>
    </>
  );
}
