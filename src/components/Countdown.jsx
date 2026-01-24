import { useEffect, useState } from "react";

export default function Countdown() {
  const deadline = new Date("2026-02-01T07:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState(deadline - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(deadline - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  if (timeLeft <= 0) {
    return (
      <div className="countdown-finish">
        Yeay Pilih Osis sudah selesai!
      </div>
    );
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className="countdown">
      <div className="countdown-item">
        <span className="countdown-num">{days}</span>
        <span className="countdown-label">Hari</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-num">{hours}</span>
        <span className="countdown-label">Jam</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-num">{minutes}</span>
        <span className="countdown-label">Menit</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-num">{seconds}</span>
        <span className="countdown-label">Detik</span>
      </div>
    </div>
  );
}