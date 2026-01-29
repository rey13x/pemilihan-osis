import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Register() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <motion.div
        className="register-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.section 
          className="register-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button className="back-btn" onClick={() => navigate("/")} type="button">
            ← Kembali
          </button>
          <h1>Register</h1>
          <p>Halaman dalam pengembangan</p>
        </motion.section>

        <motion.div 
          className="register-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="register-card">
            <p>Register akan segera tersedia</p>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
