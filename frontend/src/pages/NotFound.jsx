import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import styles from '../styles/shared.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <FiAlertTriangle size={56} className={styles.icon} />
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>Page not found</p>
      <p className={styles.hint}>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className={styles.link}>Go Home</Link>
    </div>
  );
}
