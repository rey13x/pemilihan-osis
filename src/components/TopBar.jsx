import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function TopBar() {
  const deadline = new Date("2026-02-01T07:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState(deadline - Date.now());
  const location = useLocation();

  // Only show on home page
  if (location.pathname !== "/") {
    return null;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(deadline - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className="topbar">
      <div className="topbar-countdown">
        <span className="countdown-badge">
          {String(days).padStart(2, '0')}:{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
