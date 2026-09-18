import { useState } from 'react';
import{ Link, useNavigate } from 'react-router-dom';
import{ useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import styles from '../styles/shared.module.css';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit=async(e) =>{
    e.preventDefault();
    if(!email || !password){ 
      toast.error('Fill in all fields'); 
      return; 
    }

    setLoading(true);
    try{
      const user = await login(email, password);
      toast.success('Welcome back!');
      navigate(user.role === 'admin'?'/admin':'/student');
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
        <h1 className={styles.title} style={{ fontSize: '1.75rem' }}>Sign In</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input 
              type="email" 
              className={styles.input} 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              disabled={loading}/>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input 
              type="password" 
              className={styles.input} 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              disabled={loading} 
            />
          </div>

          <button
            type="submit" 
            className={styles.btn} 
            disabled={loading} 
            style={{ marginTop: '1rem' }}>
           {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', color: '#a0a0a0', fontSize: '0.9rem', textAlign: 'center' }}>
          No account? <Link to="/register" style={{ color: '#fff' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
