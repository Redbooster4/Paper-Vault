import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ wallet }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="nav">
      <Link to="/" className="brand">Paper Vault</Link>
      <div className="right">
        {isAuthenticated && wallet && (
          <button className="wallet" onClick={wallet.connectWallet} disabled={wallet.isConnecting}>
            {wallet.isConnecting ? 'Connecting...' : (wallet.isConnected
              ? `${wallet.account.slice(0, 6)}…${wallet.account.slice(-4)}`
              : 'Connect Wallet')}
          </button>
        )}
        {isAuthenticated ? (
          <>
            <span className="badge">{user?.role}</span>
            <span className="name">{user?.username}</span>
            <button className="logout" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="link">Sign In</Link>
            <Link to="/register" className="cta">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
