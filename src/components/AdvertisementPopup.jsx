import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function AdvertisementPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Hanya tampilkan popup di halaman home (/)
    if (location.pathname !== "/") {
      setIsOpen(false);
      return;
    }

    // Tampilkan popup setelah 500ms hanya jika masih di halaman home
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

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
            src="/info/info-1.jpg"
            alt="Advertisement"
            className="ad-image"
          />
        </div>

        <a 
          href="https://whatsapp.com/channel/0029Vb5fhRYLSmbjTfTUYZ2p"
          target="_blank"
          rel="noopener noreferrer"
          className="ad-button"
        >
          PANTAU INFO!
        </a>
      </div>
    </div>
  );
}
