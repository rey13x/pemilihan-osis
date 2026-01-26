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
          <h1>Catatan</h1>
        </div>
      </motion.section>

      {/* Image & Info Section */}
      <motion.div
        className="simulasi-image-info-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="simulasi-info-wrapper">
          <img src="/info/smk2.png" alt="SMK Info" className="simulasi-info-image" />
        </div>
      </motion.div>

      {/* Content */}
      <motion.section
        className="simulasi-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="content-card">
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
