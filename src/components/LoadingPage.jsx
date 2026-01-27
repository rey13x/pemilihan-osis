import { useState, useEffect } from "react";
import illustration from "../assets/illustration.png";
import smk2Logo from "../assets/smk2.png";

export default function LoadingPage({ onLoadingComplete }) {
  const [isFlipped, setIsFlipped] = useState(false);

  /* ===============================
     AUTO FLIP LOGO - 2 SECONDS TOTAL
  =============================== */
  useEffect(() => {
    // Start flip animation immediately
    const flipInterval = setInterval(() => {
      setIsFlipped(true);
      setTimeout(() => setIsFlipped(false), 1000);
    }, 2000);

    // After 2 seconds, complete loading
    const loadingTimer = setTimeout(() => {
      clearInterval(flipInterval);
      onLoadingComplete();
    }, 2000);

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(flipInterval);
    };
  }, [onLoadingComplete]);

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
