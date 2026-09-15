import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import './styles/index.css';

export default function App() {
  const [view, setView] = useState('login');

  return (
    <main className="app">
      {view === 'login' ? (
        <Login onSwitch={() => setView('register')} />
      ) : (
        <Register onSwitch={() => setView('login')} />
      )}
    </main>
  );
}
