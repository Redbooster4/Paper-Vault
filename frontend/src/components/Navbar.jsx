import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Navbar.module.css';

export default function Navbar({ wallet }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>Paper Vault</Link>
      <div className={styles.right}>
        {isAuthenticated && wallet && (
          <button className={styles.wallet} onClick={wallet.connectWallet} disabled={wallet.isConnecting}>
            {wallet.isConnecting ? 'Connecting...' : (wallet.isConnected
              ? `${wallet.account.slice(0, 6)}…${wallet.account.slice(-4)}`
              : 'Connect Wallet')}
          </button>
        )}
        {isAuthenticated ? (
          <>
            <span className={styles.badge}>{user?.role}</span>
            <span className={styles.name}>{user?.username}</span>
            <button className={styles.logout} onClick={() => { logout(); navigate('/login'); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.link}>Sign In</Link>
            <Link to="/register" className={styles.cta}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
