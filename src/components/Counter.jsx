import { useEffect, useState } from "react";

export default function Counter() {
  const end = new Date("2026-02-01T08:00:00").getTime();
  const [time, setTime] = useState(end - Date.now());

  useEffect(() => {
    const t = setInterval(() => {
      setTime(end - Date.now());
    }, 1000);
    return () => clearInterval(t);
  }, []);

  if (time <= 0) return <span>Selesai</span>;

  const d = Math.floor(time / 86400000);
  const h = Math.floor((time / 3600000) % 24);
  const m = Math.floor((time / 60000) % 60);
  const s = Math.floor((time / 1000) % 60);

  return (
    <div className="countdown">
      <span>{d}h</span>
      <span>{h}j</span>
      <span>{m}m</span>
      <span>{s}d</span>
    </div>
  );
}
