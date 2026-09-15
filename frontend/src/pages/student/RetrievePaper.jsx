import React, { useState } from 'react';
import { retrievePaper, getPaperInfo } from '../../services/examService';
import { useOutletContext } from 'react-router-dom';
import CountdownTimer from '../../components/CountdownTimer';
import toast from 'react-hot-toast';

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
    <div className="container">
      <h1 className="title">Retrieve Paper</h1>
      <p className="subtitle">Download an exam paper you've been granted access to.</p>

      {!isConnected && (
        <div className="walletBox">
          <p>Connect your wallet to verify access</p>
          <button className="btnOutline" onClick={connectWallet} disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      )}

      <div className="formGroup">
        <label>Exam Name</label>
        <div className="inputRow">
          <input 
            className="input" 
            value={examName} 
            onChange={e => setExamName(e.target.value)} 
            placeholder="e.g. CS101-Final" 
          />
          <button className="btnOutline" onClick={handleCheck}>Check</button>
        </div>
      </div>

      {paperInfo && (
        <div className="infoBox">
          <div className="infoRow">
            <span>Status</span>
            <CountdownTimer releaseTimestamp={paperInfo.releaseTimestamp} />
          </div>
          <div className="infoRow">
            <span>Release</span>
            <span>{new Date(paperInfo.releaseTimestamp * 1000).toLocaleString()}</span>
          </div>
          <button 
            className="btnPrimary" 
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

