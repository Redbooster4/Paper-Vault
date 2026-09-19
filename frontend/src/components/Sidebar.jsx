import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, UploadCloud, Key, FileText, Download } from 'lucide-react';
import styles from '../styles/Sidebar.module.css';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: Home },
  { to: '/admin/upload', label: 'Upload Paper', icon: UploadCloud },
  { to: '/admin/grant-access', label: 'Grant Access', icon: Key },
  { to: '/admin/audit-log', label: 'Audit Log', icon: FileText },
];

const printerLinks = [
  { to: '/printer', label: 'Dashboard', icon: Home },
  { to: '/printer/retrieve', label: 'Retrieve Paper', icon: Download },
];

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const items = user?.role === 'admin' ? adminLinks : (user?.role === 'printer' ? printerLinks : []);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarInner}>
        <div className={styles.navGroup}>
          {items.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to || (to !== '/admin' && to !== '/printer' && location.pathname.startsWith(to));
            return (
              <NavLink
                key={to}
                to={to}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                {isActive && <div className={styles.activeIndicator} />}
                <div className={styles.iconContainer}>
                  <Icon className={styles.icon} />
                </div>
                <span className={styles.label}>{label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

