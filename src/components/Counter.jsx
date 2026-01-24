import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Counter() {
  const [num, setNum] = useState(0);
  const [shake, setShake] = useState(false);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    let current = 0;
    const target = 2000;
    const duration = 5000; // 5 detik
    const fps = 60;
    const totalFrames = Math.round((duration / 1000) * fps);
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(eased * target);

      // 🔥 SHAKE aktif dari 1000 → sebelum 2000
      if (current >= 1000 && current < target) {
        setShake(true);
      } else {
        setShake(false);
      }

      if (frame >= totalFrames) {
        setNum(target);
        setShake(false);

        // 💥 BOUNCE DI AKHIR
        setBounce(true);
        setTimeout(() => setBounce(false), 400);

        clearInterval(interval);
      } else {
        setNum(current);
      }
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="counter"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
    >
      {/* 🔢 ANGKA SAJA YANG GERAK */}
      <motion.span
        className="counter-big"
        animate={{
          x: shake ? [-3, 3, -3, 3, -2, 2, 0] : 0,
          scale: bounce ? [1, 1.08, 0.98, 1] : 1
        }}
        transition={{
          x: {
            duration: 0.25,
            repeat: shake ? Infinity : 0,
            ease: "linear"
          },
          scale: {
            duration: 0.4,
            ease: "easeOut"
          }
        }}
      >
        {num}
      </motion.span>

      {/* 🏷️ TEKS DIAM */}
      <span className="counter-small">SISWA/I</span>
    </motion.div>
  );
}
