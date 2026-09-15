import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';

export default function StudentDashboard() {
  const { account, isConnected } = useOutletContext();

  return (
    <div className="container">
      <h1 className="title">Student Dashboard</h1>
      <p className="subtitle">Retrieve your authorized exam papers.</p>

      {isConnected && (
        <p className="walletInfo">
          Connected Wallet: <code>{account}</code>
        </p>
      )}

      <div className="grid">
        <Link to="/student/retrieve" className="card">
          <h2>Retrieve Paper</h2>
          <p>Download an exam paper you have access to.</p>
        </Link>
      </div>
    </div>
  );
}

