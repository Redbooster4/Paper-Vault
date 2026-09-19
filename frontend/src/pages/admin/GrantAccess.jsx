import { useState, useEffect } from 'react';
import { grantAccess } from '../../services/examService';
import api from '../../services/api';
import toast from 'react-hot-toast';
import styles from '../../styles/shared.module.css';

export default function GrantAccess() {
  const [examName, setExamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/auth/users');
        setUsers(data); 
      } catch (err) {
        console.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!examName.trim()) { toast.error('Exam name is required'); return; }
    if (selectedUsers.length === 0) { toast.error('Select at least one user'); return; }

    setLoading(true);
    const newResults = [];
    for (const addr of selectedUsers) {
      try {
        await grantAccess(examName.trim(), addr);
        newResults.push({ address: addr, status: 'success' });
      } catch (err) {
        newResults.push({ address: addr, status: 'error', error: err.response?.data?.error });
      }
    }
    setResults(prev => [...prev, ...newResults]);
    const successCount = newResults.filter(r => r.status === 'success').length;
    toast.success(`${successCount}/${selectedUsers.length} grants succeeded`);
    setSelectedUsers([]);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}> Grant Access</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
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

        <div className={styles.field}>
          <label className={styles.label}>Select Users to Grant Access</label>
          <div className={styles.userList} style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #333', padding: '10px', borderRadius: '4px' }}>
            {users.length === 0 ? (
              <p style={{ color: '#888', margin: 0 }}>No users found.</p>
            ) : (
              users.map(u => {
                const hasWallet = !!u.walletAddress;
                return (
                  <label key={u._id || u.username} style={{ display: 'block', marginBottom: '8px', cursor: hasWallet ? 'pointer' : 'not-allowed', opacity: hasWallet ? 1 : 0.6 }}>
                    <input
                      type="checkbox"
                      value={u.walletAddress || ''}
                      checked={hasWallet && selectedUsers.includes(u.walletAddress)}
                      onChange={(e) => {
                        if (!hasWallet) return;
                        if (e.target.checked) {
                          setSelectedUsers(prev => [...prev, u.walletAddress]);
                        } else {
                          setSelectedUsers(prev => prev.filter(addr => addr !== u.walletAddress));
                        }
                      }}
                      disabled={loading || !hasWallet}
                      style={{ marginRight: '8px' }}
                    />
                    {u.username} ({u.role}) 
                    {hasWallet 
                      ? ` - ${u.walletAddress.slice(0, 6)}...${u.walletAddress.slice(-4)}`
                      : ' (No Wallet Address)'}
                  </label>
                );
              })
            )}
          </div>
        </div>

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
                {r.status === 'success' ? 'Pass' : 'Fail'}
                <span className={styles.resultAddr} style={{ marginLeft: '8px' }}>
                  {r.address.slice(0, 10)}...{r.address.slice(-6)}
                </span>
                {r.error && <span className={styles.resultErrMsg} style={{ marginLeft: '8px', color: '#ff4444' }}>{r.error}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
