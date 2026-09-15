import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!email || !password) { throw new Error('Please fill in all fields'); }
      if (!email.includes('@')) { throw new Error('Please enter a valid email address'); }
      if (password.length < 6) { throw new Error('Password must be at least 6 characters'); }
      await new Promise(r => setTimeout(r, 1000));
      localStorage.setItem('userEmail', email);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to your account</p>
        {error && <div className={styles.alert + ' ' + styles.alertError}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor='email' className={styles.label}>Email Address</label>
            <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email' className={styles.input} autoFocus required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor='password' className={styles.label}>Password</label>
            <div className={styles.inputGroup}>
              <input type={showPassword ? 'text' : 'password'} id='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password' className={styles.input} required />
              <button type='button' onClick={() => setShowPassword(!showPassword)} className={styles.toggleButton + (showPassword ? ' ' + styles.active : '')} aria-label='Toggle password visibility'>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input type='checkbox' checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className={styles.checkbox} />
              Remember me
            </label>
          </div>
          <button type='submit' className={styles.submitButton} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div className={styles.divider}>
          <span>Don't have an account?</span>
        </div>
        <Link to='/register' className={styles.registerButton}>Create Account</Link>
        <p className={styles.footerText}>
          <a href='#' className={styles.forgotLink}>Forgot Password?</a>
        </p>
      </div>
    </div>
  );
}

export default Login;