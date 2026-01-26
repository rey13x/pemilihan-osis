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
          <h1>Cara Memilih</h1>
          <p>Ikuti langkah-langkah berikut untuk melakukan voting</p>
        </div>
      </motion.section>

      {/* Steps */}
      <motion.section
        className="simulasi-steps"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="step-item">
          <div className="step-number">1</div>
          <h3>Baca dengan Seksama</h3>
          <p>Perhatikan visi dan misi setiap paslon dengan baik</p>
        </div>

        <div className="step-item">
          <div className="step-number">2</div>
          <h3>Pilih Paslon</h3>
          <p>Tentukan pilihan kamu sesuai dengan hati nurani</p>
        </div>

        <div className="step-item">
          <div className="step-number">3</div>
          <h3>Konfirmasi</h3>
          <p>Pastikan pilihan kamu sebelum menyerahkan suara</p>
        </div>
      </motion.section>

      {/* Content */}
      <motion.section
        className="simulasi-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="content-card">
          <h2>Persyaratan Pemilih</h2>
          <ul>
            <li>Pelajar SMKN 2 Kota Bekasi</li>
            <li>Terdaftar dalam daftar pemilih</li>
            <li>Belum pernah melakukan voting sebelumnya</li>
            <li>Memiliki token yang valid</li>
          </ul>
        </div>

        <div className="content-card">
          <h2>Catatan Penting</h2>
          <ul>
            <li>Setiap pemilih hanya dapat memilih satu kali</li>
            <li>Pilihan kamu bersifat rahasia dan aman</li>
            <li>Jangan bagikan token kamu kepada siapapun</li>
            <li>Hasil voting akan ditampilkan secara real-time</li>
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
