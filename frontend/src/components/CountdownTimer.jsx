import { useState, useEffect } from 'react';

export default function CountdownTimer({ releaseTimestamp }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calc = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = releaseTimestamp - now;
      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }
      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      setTimeLeft({ days, hours, minutes, seconds });
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [releaseTimestamp]);

  if (!timeLeft) {
    return <span className="released">✓ Released</span>;
  }

  return (
    <div className="timer">
      <div className="unit">
        <span className="value">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="label">Days</span>
      </div>
      <span className="sep">:</span>
      <div className="unit">
        <span className="value">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="label">Hrs</span>
      </div>
      <span className="sep">:</span>
      <div className="unit">
        <span className="value">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="label">Min</span>
      </div>
      <span className="sep">:</span>
      <div className="unit">
        <span className="value">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="label">Sec</span>
      </div>
    </div>
  );
}
