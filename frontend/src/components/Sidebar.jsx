import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = {
  admin: [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/upload', label: 'Upload Paper' },
    { to: '/admin/grant-access', label: 'Grant Access' },
    { to: '/admin/audit-log', label: 'Audit Log' },
  ],
  student: [
    { to: '/student', label: 'Dashboard' },
    { to: '/student/retrieve', label: 'Retrieve Paper' },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const items = links[user?.role] || [];

  return (
    <aside className="sidebar">
      {items.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/admin' || to === '/student'}
          className={({ isActive }) => `${'link'} ${isActive ? 'active' : ''}`}
        >
          {label}
        </NavLink>
      ))}
    </aside>
  );
}
