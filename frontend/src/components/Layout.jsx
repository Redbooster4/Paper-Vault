import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Layout.module.css';

export default function Layout({ wallet }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.layout}>
      <Navbar wallet={wallet} />
      <div className={styles.body}>
        {isAuthenticated && <Sidebar />}
        <main className={styles.content}>
          <Outlet context={wallet} />
        </main>
      </div>
    </div>
  );
}
