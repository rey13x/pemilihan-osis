import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

export default function Counter() {
  const controls = useAnimation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    let current = 0;

    // ===== PHASE 1: 0 → 100 (LAMBAT) =====
    const slowInterval = setInterval(() => {
      current += 3;
      setValue(current);

      if (current >= 100) {
        clearInterval(slowInterval);

        // ===== PHASE 2: 100 → 2000 (SEDANG TANPA GETER) =====
        const fastInterval = setInterval(() => {
          current += 40;
          setValue(current);

          if (current >= 2000) {
            clearInterval(fastInterval);
            setValue(2000);

            // ===== PHASE 3: BOUNCY ZOOM (HANYA NUMBER) =====
            controls.start({
              scale: [1, 1.25, 0.95, 1],
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 12,
              },
            });
          }
        }, 40);
      }
    }, 50);

    return () => {
      clearInterval(slowInterval);
    };
  }, [controls]);

  return (
    <motion.div className="counter" animate={controls}>
      <span className="counter-big">{value}</span>
      <span className="counter-small">SISWA/I</span>
    </motion.div>
  );
}
