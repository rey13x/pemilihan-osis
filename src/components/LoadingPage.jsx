import { useState, useEffect } from "react";
import illustration from "../assets/illustration.png";
import smk2Logo from "../assets/smk2.png";

export default function LoadingPage({ onLoadingComplete }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);

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

  /* ===============================
     PROGRESS ANIMATION
  =============================== */
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // Stop at 90%, wait for actual completion
        return prev + Math.random() * 20; // Random increment
      });
    }, 300);

    return () => clearInterval(interval);
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

        {/* Loading Progress Bar */}
        <div className="loading-progress-bar">
          <div 
            className="loading-progress-fill" 
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        <p className="loading-text">memuat aset...</p>
      </div>
    </div>
  );
}

