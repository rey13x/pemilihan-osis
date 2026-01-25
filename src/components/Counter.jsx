import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

export default function Counter() {
  const controls = useAnimation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    let current = 0;

    // ===== PHASE 1: 0 → 100 (PELANN) =====
    const slowInterval = setInterval(() => {
      current += 4;
      setValue(current);

      if (current >= 100) {
        clearInterval(slowInterval);

        // ===== PHASE 2: 100 → 2000 (NGEBUT + GETER) =====
        controls.start({
          x: [-4, 4, -4, 4],
          rotate: [-1, 1, -1, 1],
          transition: {
            duration: 0.1,
            repeat: Infinity,
          },
        });

        const fastInterval = setInterval(() => {
          current += 60;
          setValue(current);

          if (current >= 2000) {
            clearInterval(fastInterval);
            setValue(2000);

            // STOP GETER
            controls.stop();

            // ===== PHASE 3: BOUNCY ZOOM =====
            controls.start({
              scale: [1, 1.25, 0.95, 1],
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 12,
              },
            });
          }
        }, 20);
      }
    }, 30);

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
