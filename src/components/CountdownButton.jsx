import { useEffect, useState } from "react";

export default function CountdownButton() {
  // 🔧 ATUR WAKTU BERAKHIR DI SINI
  // format: new Date("YYYY-MM-DDTHH:MM:SS")
  const endTime = new Date("2026-02-01T08:00:00"); // contoh

  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());
  const [finished, setFinished] = useState(false);

  function getTimeRemaining() {
    const now = new Date();
    const diff = endTime - now;

    if (diff <= 0) {
      setFinished(true);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  }

  useEffect(() => {
    if (finished) return;

    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [finished]);

  if (finished) {
    return <span>Yeay, sesi Pilih Osis sudah selesai!</span>;
  }

  return (
    <span>
      {timeLeft.days}h {timeLeft.hours}j {timeLeft.minutes}m {timeLeft.seconds}d
    </span>
  );
}
