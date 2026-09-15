import { useState } from 'react';
import { grantAccess } from '../../services/examService';
import toast from 'react-hot-toast';
import styles from '../../styles/GrantAccess.module.css';

export default function GrantAccess() {
  const [examName, setExamName] = useState('');
  const [address, setAddress] = useState('');
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkAddresses, setBulkAddresses] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const isValidAddress = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr);

  const handleSingleGrant = async (e) => {
    e.preventDefault();
    if (!examName.trim()) { toast.error('Exam name is required'); return; }
    if (!isValidAddress(address)) { toast.error('Invalid Ethereum address'); return; }

    setLoading(true);
    try {
      await grantAccess(examName.trim(), address);
      toast.success(`Access granted to ${address.slice(0, 6)}...${address.slice(-4)}`);
      setResults(prev => [...prev, { address, status: 'success' }]);
      setAddress('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to grant access');
      setResults(prev => [...prev, { address, status: 'error', error: err.response?.data?.error }]);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkGrant = async (e) => {
    e.preventDefault();
    if (!examName.trim()) { toast.error('Exam name is required'); return; }

    const addresses = bulkAddresses
      .split('\n')
      .map(a => a.trim())
      .filter(a => a.length > 0);

    if (addresses.length === 0) { toast.error('Enter at least one address'); return; }

    const invalid = addresses.filter(a => !isValidAddress(a));
    if (invalid.length > 0) {
      toast.error(`${invalid.length} invalid address(es) found`);
      return;
    }

    setLoading(true);
    const newResults = [];
    for (const addr of addresses) {
      try {
        await grantAccess(examName.trim(), addr);
        newResults.push({ address: addr, status: 'success' });
      } catch (err) {
        newResults.push({ address: addr, status: 'error', error: err.response?.data?.error });
      }
    }
    setResults(prev => [...prev, ...newResults]);
    const successCount = newResults.filter(r => r.status === 'success').length;
    toast.success(`${successCount}/${addresses.length} grants succeeded`);
    setBulkAddresses('');
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}> Grant Access</h1>
      <p className={styles.subtitle}>
        Authorize wallet addresses to retrieve an exam paper after it's released.
      </p>

      <form onSubmit={bulkMode ? handleBulkGrant : handleSingleGrant} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="examName" className={styles.label}>Exam Name</label>
          <input
            type="text"
            id="examName"
            className={styles.input}
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            placeholder="e.g. CS101-Final-2026"
            disabled={loading}
          />
        </div>

        <div className={styles.modeToggle}>
          <button
            type="button"
            className={`${styles.modeBtn} ${!bulkMode ? styles.active : ''}`}
            onClick={() => setBulkMode(false)}
          >
            Single Address
          </button>
          <button
            type="button"
            className={`${styles.modeBtn} ${bulkMode ? styles.active : ''}`}
            onClick={() => setBulkMode(true)}
          >
            Bulk Mode
          </button>
        </div>

        {bulkMode ? (
          <div className={styles.field}>
            <label htmlFor="bulkAddresses" className={styles.label}>Wallet Addresses (one per line)</label>
            <textarea
              id="bulkAddresses"
              className={styles.textarea}
              value={bulkAddresses}
              onChange={(e) => setBulkAddresses(e.target.value)}
              placeholder={"0x1234...abcd\n0x5678...efgh\n0x9abc...ijkl"}
              rows={6}
              disabled={loading}
            />
          </div>
        ) : (
          <div className={styles.field}>
            <label htmlFor="address" className={styles.label}>Wallet Address</label>
            <input
              type="text"
              id="address"
              className={styles.input}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              disabled={loading}
            />
            {address && !isValidAddress(address) && (
              <span className={styles.error}>Invalid Ethereum address format</span>
            )}
          </div>
        )}

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Granting Access...' : 'Grant Access'}
        </button>
      </form>

      {results.length > 0 && (
        <div className={styles.results}>
          <h3 className={styles.resultsTitle}>Results</h3>
          <div className={styles.resultsList}>
            {results.map((r, i) => (
              <div key={i} className={`${styles.resultItem} ${r.status === 'success' ? styles.resultSuccess : styles.resultError}`}>
                {r.status === 'success' ? '✅' : '❌'}
                <span className={styles.resultAddr}>
                  {r.address.slice(0, 10)}...{r.address.slice(-6)}
                </span>
                {r.error && <span className={styles.resultErrMsg}>{r.error}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
