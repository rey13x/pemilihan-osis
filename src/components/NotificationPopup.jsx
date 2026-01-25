import { useState, useEffect } from "react";
import "./NotificationPopup.css";

export default function NotificationPopup({ message, type, isOpen, onClose }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setIsAnimating(true);
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const emoji = type === "success" ? "👍" : "😢";

  return (
    <div className="notification-overlay">
      <div className={`notification-popup ${type} ${isAnimating ? "animate" : ""}`}>
        <div className="notification-header">
          <span className={`notification-emoji ${isAnimating ? "bouncy" : ""}`}>
            {emoji}
          </span>
          <p className="notification-message">{message}</p>
        </div>
      </div>
    </div>
  );
}
