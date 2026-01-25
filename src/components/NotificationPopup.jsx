import { useState, useEffect } from "react";
import "./NotificationPopup.css";

export default function NotificationPopup({ message, type, isOpen, onClose }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setTimeout(() => onClose(), 300);
          return 0;
        }
        return prev - 1.5;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === "success";
  const bgColor = isSuccess ? "#10b981" : "#ef4444";
  const icon = isSuccess ? "✓" : "✕";

  return (
    <div className="notification-overlay">
      <div className={`notification-popup ${type}`}>
        <div className="notification-header">
          <span className="notification-icon">{icon}</span>
          <p className="notification-message">{message}</p>
        </div>
        <div className="notification-progress-bar">
          <div
            className="notification-progress-fill"
            style={{ width: `${progress}%`, backgroundColor: bgColor }}
          ></div>
        </div>
      </div>
    </div>
  );
}
