import { useState, useEffect } from "react";

export default function AdvertisementPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup on first load
    const hasShownAd = localStorage.getItem("adShown");
    if (!hasShownAd) {
      setIsOpen(true);
      localStorage.setItem("adShown", "true");
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="ad-overlay" onClick={handleClose}>
      <div className="ad-popup" onClick={(e) => e.stopPropagation()}>
        <button className="ad-close" onClick={handleClose}>✕</button>
        
        <div className="ad-image-container">
          <img
            src="/ads/banner.png"
            alt="Advertisement"
            className="ad-image"
          />
        </div>

        <button className="ad-button">PANTAU INFO!</button>
      </div>
    </div>
  );
}
