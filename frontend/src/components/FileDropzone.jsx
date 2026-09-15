import { useState, useRef, useCallback } from 'react';

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

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleClick = () => { if (!disabled) inputRef.current?.click(); };

  const handleChange = (e) => { handleFile(e.target.files[0]); };

  const handleRemove = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div
      className={`${'dropzone'} ${dragOver ? 'dragOver' : ''} ${disabled ? 'disabled' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hiddenInput"
        disabled={disabled}
      />
      {selectedFile ? (
        <div className="fileInfo">
          
          <div className="fileMeta">
            <span className="fileName">{selectedFile.name}</span>
            <span className="fileSize">{formatSize(selectedFile.size)}</span>
          </div>
          <button className="removeBtn" onClick={handleRemove} title="Remove file">
            
          </button>
        </div>
      ) : (
        <div className="placeholder">
          
          <p className="text">Drag & drop a PDF here, or click to browse</p>
          <span className="hint">Only PDF files accepted</span>
        </div>
      )}
    </div>
  );
}
