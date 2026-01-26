import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/PageTransition.css";

export default function PageTransition() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="page-transition"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      onAnimationComplete={() => setIsVisible(false)}
    >
      <div className="loading-spinner">
        <div className="spinner-circle"></div>
        <p>Memuat...</p>
      </div>
    </motion.div>
  );
}
