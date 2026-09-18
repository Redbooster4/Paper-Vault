import React,{ useState } from 'react';
import{ Link, useNavigate } from 'react-router-dom';
import{ useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import styles from '../styles/shared.module.css';

export default function Register(){
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit=async(e) =>{
    e.preventDefault();
    if(!username || !email || !password){ 
      toast.error('Fill in all fields');
      return; 
    }
    if(password.length < 8){ 
      toast.error('Password must be at least 8 characters'); 
      return; 
    }

    setLoading(true);
    try{
      await register(username, email, password, role);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } 
    catch(err){
      toast.error(err.response?.data?.error);
    } 
    finally{
      setLoading(false);
    }
  };

  return(
    <div className={styles.container}>
      <div className={styles.card} style={{ width: '100%', margin: '4rem auto' }}>
        <h1 className={styles.title} style={{ fontSize: '1.75rem' }}>Create Account</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input className={styles.input} value={username} onChange={e => setUsername(e.target.value)} disabled={loading} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input type="email" className={styles.input} value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input type="password" className={styles.input} value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
          </div>

          <div className={styles.field} style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
            <label className={styles.label} style={{ alignSelf: 'center', marginRight: '10px' }}>Role:</label>
            <button 
              type="button" 
              className={styles.btn} 
              style={{ flex: 1, background: role === 'student' ? '#fff' : 'transparent', color: role === 'student' ? '#000' : '#fff', border: '1px solid #555' }}
              onClick={() => setRole('student')}>
                Student
            </button>
            <button 
              type="button" 
              className={styles.btn} 
              style={{ flex: 1, background: role === 'admin' ? '#fff' : 'transparent', color: role === 'admin' ? '#000' : '#fff', border: '1px solid #555' }}
              onClick={() => setRole('admin')}
            >
              Exam Board
            </button>
          </div>
          <button 
            type="submit" 
            className={styles.btn} 
            disabled={loading} 
            style={{ marginTop: '1rem' }}
          >
           {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', color: '#a0a0a0', fontSize: '0.9rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: '#fff' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}