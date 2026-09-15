import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import './styles/module.css';

function App() {
  return (
    <BrowserRouter>
      <div className='app-container'>
        <nav className='navbar'>
          <div className='nav-brand'>Paper Vault</div>
          <div className='nav-links'>
            <Link to='/login' className='nav-link'>Login</Link>
            <Link to='/register' className='nav-link'>Register</Link>
          </div>
        </nav>
        <main className='main-content'>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/' element={<a href='/login'>Go to Login</a>} />
            <Route path='*' element={<div>404</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;