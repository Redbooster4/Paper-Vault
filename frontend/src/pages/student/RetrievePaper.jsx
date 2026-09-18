import React, { useState } from 'react';
import { retrievePaper, getPaperInfo } from '../../services/examService';
import { useOutletContext } from 'react-router-dom';
import CountdownTimer from '../../components/CountdownTimer';
import toast from 'react-hot-toast';
import styles from '../../styles/shared.module.css';

export default function RetrievePaper() {
  const { account, isConnected, isConnecting, connectWallet } = useOutletContext();
  const [examName, setExamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [paperInfo, setPaperInfo] = useState(null);

  const handleCheck = async () => {
    if (!examName) { toast.error('Enter an exam name'); return; }
    try {
      const info = await getPaperInfo(examName);
      setPaperInfo(info);
    } catch {
      toast.error('Paper not found');
    }
  };

  const handleDownload = async () => {
    if (!isConnected) { toast.error('Connect your wallet first'); return; }
    setLoading(true);
    try {
      const blob = await retrievePaper(examName, account);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${examName}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Paper downloaded!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Access denied or not yet released');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Retrieve Paper</h1>
      
      {!isConnected && (
        <div className={styles.walletBox}>
          <p>Connect your wallet to verify access</p>
          <button className={styles.btnOutline} onClick={connectWallet} disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      )}

      <div className={styles.formGroup}>
        <label>Exam Name</label>
        <div className={styles.inputRow}>
          <input 
            className={styles.input} 
            value={examName} 
            onChange={e => setExamName(e.target.value)} 
            placeholder="e.g. CS101-Final" 
          />
          <button className={styles.btnOutline} onClick={handleCheck}>Check</button>
        </div>
      </div>

      {paperInfo && (
        <div className={styles.infoBox}>
          <div className={styles.infoRow}>
            <span>Status</span>
            <CountdownTimer releaseTimestamp={paperInfo.releaseTimestamp} />
          </div>
          <div className={styles.infoRow}>
            <span>Release</span>
            <span>{new Date(paperInfo.releaseTimestamp * 1000).toLocaleString()}</span>
          </div>
          <button 
            className={styles.btnPrimary} 
            onClick={handleDownload} 
            disabled={loading || !isConnected}
          >
            {loading ? 'Downloading...' : 'Download Paper'}
          </button>
        </div>
      )}
    </div>
  );
}

