import { useState, useEffect } from 'react';
import styles from '../styles/CountdownTimer.module.css';

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
    return <span className={styles.released}>✓ Released</span>;
  }

  return (
    <div className={styles.timer}>
      <div className={styles.unit}>
        <span className={styles.value}>{String(timeLeft.days).padStart(2, '0')}</span>
        <span className={styles.label}>Days</span>
      </div>
      <span className={styles.sep}>:</span>
      <div className={styles.unit}>
        <span className={styles.value}>{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className={styles.label}>Hrs</span>
      </div>
      <span className={styles.sep}>:</span>
      <div className={styles.unit}>
        <span className={styles.value}>{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className={styles.label}>Min</span>
      </div>
      <span className={styles.sep}>:</span>
      <div className={styles.unit}>
        <span className={styles.value}>{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className={styles.label}>Sec</span>
      </div>
    </div>
  );
}
