import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ConfusedPopup({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/");
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="confused-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="confused-popup"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2>Masih Bingung?</h2>
        <p className="confused-desc">Kamu akan diarahkan ke Beranda!</p>
        
        <div className="confused-countdown">
          <span className="countdown-number">{countdown}</span>
        </div>

        <button className="confused-close-btn" onClick={() => {
          navigate("/");
          onClose();
        }}>
          Kembali Sekarang
        </button>
      </motion.div>
    </motion.div>
  );
}
