import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Layout({ wallet }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="layout">
      <Navbar wallet={wallet} />
      <div className="body">
        {isAuthenticated && <Sidebar />}
        <main className="content">
          <Outlet context={wallet} />
        </main>
      </div>
    </div>
  );
}
