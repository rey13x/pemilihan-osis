import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const texts = [
  "Tentukan Pilihanmu Sekarang!",
  "Suaramu Masa Depan OSIS!",
  "Saatnya Anak Muda Bersuara!"
];

export default function AnimatedButtonText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 2000); // ganti teks tiap 2 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="btn-text-wrapper">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="btn-text"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut"
          }}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
