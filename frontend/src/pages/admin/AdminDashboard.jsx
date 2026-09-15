import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getPaperInfo } from '../../services/examService';
import CountdownTimer from '../../components/CountdownTimer';
import toast from 'react-hot-toast';
import styles from '../../styles/AdminDashboard.module.css';

export default function AdminDashboard() {
  const [searchName, setSearchName] = useState('');
  const [recentPaper, setRecentPaper] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchName.trim()) return;
    setSearching(true);
    try {
      const info = await getPaperInfo(searchName.trim());
      setRecentPaper({ name: searchName.trim(), ...info });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Paper not found');
      setRecentPaper(null);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Exam Board Dashboard</h1>
        <p className={styles.subtitle}>Manage exam papers, grant access, and monitor activity</p>
      </div>

      {/* Quick Actions */}
      <div className={styles.actions}>
        <Link to="/admin/upload" className={styles.actionCard}>
          <div className={styles.actionIcon}></div>
          <div>
            <h3>Upload Paper</h3>
            <p>Encrypt and register a new exam paper</p>
          </div>
        </Link>
        <Link to="/admin/grant-access" className={styles.actionCard}>
          <div className={styles.actionIcon}></div>
          <div>
            <h3>Grant Access</h3>
            <p>Authorize wallets to retrieve papers</p>
          </div>
        </Link>
        <Link to="/admin/audit-log" className={styles.actionCard}>
          <div className={styles.actionIcon}></div>
          <div>
            <h3>Audit Log</h3>
            <p>View blockchain event history</p>
          </div>
        </Link>
      </div>

      {/* Quick Paper Lookup */}
      <div className={styles.lookupSection}>
        <h2 className={styles.sectionTitle}> Quick Paper Lookup</h2>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Enter exam name..."
            className={styles.searchInput}
            disabled={searching}
          />
          <button type="submit" className={styles.searchBtn} disabled={searching || !searchName.trim()}>
            
            {searching ? 'Searching...' : 'Look Up'}
          </button>
        </form>

        {recentPaper && (
          <div className={styles.paperCard}>
            <div className={styles.paperHeader}>
              <h3>{recentPaper.name}</h3>
              <CountdownTimer releaseTimestamp={recentPaper.releaseTimestamp} />
            </div>
            <div className={styles.paperMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Storage Hash</span>
                <span className={styles.metaValue}>{recentPaper.ipfsHash}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Release Time</span>
                <span className={styles.metaValue}>
                  {new Date(recentPaper.releaseTimestamp * 1000).toLocaleString()}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Uploaded By</span>
                <span className={styles.metaValueMono}>{recentPaper.uploadedBy}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
