import { useState, useEffect } from "react";
import illustration from "../assets/illustration.png";
import smk2Logo from "../assets/smk2.png";

export default function LoadingPage({ onLoadingComplete }) {
  const [isFlipped, setIsFlipped] = useState(false);

  /* ===============================
     AUTO FLIP LOGO - CONTINUOUS FLIP
  =============================== */
  useEffect(() => {
    // Flip animation - flips every 1 second continuously
    const flipInterval = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 1000);

    return () => {
      clearInterval(flipInterval);
    };
  }, []);

  return (
    <div className="loading-page">
      <div className="loading-content">
        <div
          className={`logo-flip ${isFlipped ? "is-flipped" : ""}`}
        >
          <div className="logo-flip-inner">
            <img
              src={illustration}
              alt="Logo OSIS"
              className="logo-face"
              draggable="false"
            />
            <img
              src={smk2Logo}
              alt="Logo SMKN 2"
              className="logo-face logo-back"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
