import { useState, useEffect } from "react";
import "./AdvertisementPopup.css";

export default function AdvertisementPopup() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Show popup on first load only
    const shown = sessionStorage.getItem("adPopupShown");
    if (shown) {
      setIsOpen(false);
    } else {
      sessionStorage.setItem("adPopupShown", "true");
    }
  }, []);

  if (!isOpen) return null;

  const handlePhotoClick = () => {
    window.open("https://wa.me/6281319865384", "_blank");
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="ad-overlay">
      <div className="ad-popup">
        <button className="ad-close" onClick={handleClose}>
          ✕
        </button>

        <img
          src="/public/logo-smk2.png"
          alt="SMK Negeri 2 Kota Bekasi"
          className="ad-image"
          onClick={handlePhotoClick}
        />

        <button className="ad-button" onClick={handlePhotoClick}>
          Pantau Informasi
        </button>
      </div>
    </div>
  );
}
