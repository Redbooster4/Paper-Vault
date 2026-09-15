import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/LandingPage.module.css';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Welcome to Paper Vault</h1>
        <p className={styles.subtitle}>
          Secure exam paper distribution powered by blockchain. Upload, encrypt, and distribute papers with time-locked access control.
        </p>
        
        <div className={styles.actions}>
          <Link to="/register" className={styles.primaryBtn}>Get Started</Link>
          <Link to="/login" className={styles.secondaryBtn}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
