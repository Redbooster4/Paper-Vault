import { useState, useRef, useCallback } from 'react';
import { UploadCloud, File, X, CheckCircle } from 'lucide-react';
import styles from '../styles/FileDropzone.module.css';

export default function FileDropzone({ onFileSelect, accept = '.pdf', disabled = false }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [disabled, handleFile]);

  return (
    <div className={styles.wrapper}>
      {!selectedFile ? (
        <div
          className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''} ${disabled ? styles.disabled : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => { if (!disabled) inputRef.current?.click(); }}
        >
          <input ref={inputRef} type="file" accept={accept} onChange={(e) => handleFile(e.target.files[0])} className={styles.hiddenInput} disabled={disabled} />
          <div className={styles.iconCircle}>
            <UploadCloud className={styles.uploadIcon} />
          </div>
          <h3 className={styles.title}>Click or drag file to this area to upload</h3>
          <p className={styles.subtitle}>Strictly prohibit from uploading company data or other banned files.</p>
        </div>
      ) : (
        <div className={styles.fileCard}>
          <div className={styles.fileCardInner}>
            <File className={styles.fileIcon} />
            <div className={styles.fileDetails}>
              <span className={styles.fileName}>{selectedFile.name}</span>
              <span className={styles.fileSize}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <CheckCircle className={styles.successIcon} />
            <button type="button" className={styles.removeBtn} onClick={(e) => { e.stopPropagation(); setSelectedFile(null); onFileSelect(null); }}>
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
