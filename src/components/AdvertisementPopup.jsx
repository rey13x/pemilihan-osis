import { useState, useEffect } from "react";

export default function AdvertisementPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Tampilkan popup setelah 500ms
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);

    return () => clearTimeout(timer);
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
            src="/info-1.jpg"
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
