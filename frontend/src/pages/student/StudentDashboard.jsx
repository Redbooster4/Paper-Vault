import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import styles from '../../styles/shared.module.css';

export default function StudentDashboard() {
  const { account, isConnected } = useOutletContext();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Student Dashboard</h1>
      
      {isConnected && (
        <p className={styles.walletInfo}>
          Connected Wallet: <code>{account}</code>
        </p>
      )}

      <div className={styles.grid}>
        <Link to="/student/retrieve" className={styles.card}>
          <h2>Retrieve Paper</h2>
          <p>Download an exam paper you have access to.</p>
        </Link>
      </div>
    </div>
  );
}

