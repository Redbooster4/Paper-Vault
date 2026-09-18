import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../../services/examService';
import styles from '../../styles/shared.module.css';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogs()
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}> Chain History</h1>
            
      <div className={styles.card}>
        {loading ? (
          <p className={styles.empty}>Fetching blocks...</p>
        ) : logs.length === 0 ? (
          <p className={styles.empty}>No events found on the blockchain.</p>
        ) : (
          <div className={styles.timeline}>
            {logs.map((log, i) => (
              <div key={i} className={styles.logItem}>
                <div className={styles.logBadge} data-type={log.type}>
                  {log.type}
                </div>
                <div className={styles.logContent}>
                  <div className={styles.logHeader}>
                    <strong> Exam ID:</strong> <span>{log.examId.slice(0, 10)}...{log.examId.slice(-8)}</span>
                  </div>
                  <div className={styles.logDetail}>{log.info}</div>
                  <div className={styles.logFooter}>
                    <span title="Transaction Hash"> {log.tx.slice(0, 10)}...</span>
                    <span title="Block Number"> Block {log.block}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
