import { useState } from 'react';
import { uploadPaper } from '../../services/examService';
import FileDropzone from '../../components/FileDropzone';
import toast from 'react-hot-toast';

export default function UploadPaper() {
  const [file, setFile] = useState(null);
  const [examName, setExamName] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !examName.trim() || !releaseDate) {
      toast.error('All fields are required');
      return;
    }

    const timestamp = Math.floor(new Date(releaseDate).getTime() / 1000);
    if (timestamp <= Math.floor(Date.now() / 1000)) {
      toast.error('Release time must be in the future');
      return;
    }

    setLoading(true);
    try {
      const data = await uploadPaper(file, examName.trim(), timestamp);
      setResult(data);
      toast.success('Paper uploaded and registered on-chain!');
      setFile(null);
      setExamName('');
      setReleaseDate('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title"> Upload Exam Paper</h1>
      <p className="subtitle">
        Upload a PDF exam paper. It will be AES-256 encrypted and registered on the blockchain.
      </p>

      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <label className="label">Exam Paper (PDF)</label>
          
        </div>

        <div className="field">
          <label htmlFor="examName" className="label">Exam Name</label>
          <input
            type="text"
            id="examName"
            className="input"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            placeholder="e.g. CS101-Final-2026"
            disabled={loading}
          />
        </div>

        <div className="field">
          <label htmlFor="releaseDate" className="label">Release Date & Time</label>
          <input
            type="datetime-local"
            id="releaseDate"
            className="input"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            disabled={loading}
          />
          <span className="hint">Paper will be accessible only after this time</span>
        </div>

        <button type="submit" className="submitBtn" disabled={loading}>
          {loading ? 'Uploading & Registering...' : 'Upload & Register on Chain'}
        </button>
      </form>

      {result && (
        <div className="result">
          
          <h3>Paper Registered Successfully</h3>
          <div className="resultMeta">
            <div>
              <span className="resultLabel">Exam ID</span>
              <span className="resultValue">{result.examId}</span>
            </div>
            <div>
              <span className="resultLabel">Stored As</span>
              <span className="resultValue">{result.storedAs}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
