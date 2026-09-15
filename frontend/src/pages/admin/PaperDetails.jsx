import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPaperInfo } from '../../services/examService';
import CountdownTimer from '../../components/CountdownTimer';
import toast from 'react-hot-toast';

export default function PaperDetails() {
  const { examName: paramName } = useParams();
  const [examName, setExamName] = useState(paramName || '');
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!examName.trim()) return;
    setLoading(true);
    try {
      const info = await getPaperInfo(examName.trim());
      setPaper(info);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Paper not found');
      setPaper(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title"> Paper Details</h1>
      <p className="subtitle">Look up on-chain metadata for any registered exam paper.</p>

      <form onSubmit={handleLookup} className="searchForm">
        <input
          type="text"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          placeholder="Enter exam name..."
          className="input"
          disabled={loading}
        />
        <button type="submit" className="searchBtn" disabled={loading || !examName.trim()}>
          
          {loading ? 'Loading...' : 'Look Up'}
        </button>
      </form>

      {paper && (
        <div className="details">
          <div className="detailRow">
            <span className="detailLabel">Exam Name</span>
            <span className="detailValue">{examName}</span>
          </div>
          <div className="detailRow">
            <span className="detailLabel">Storage Hash</span>
            <span className="detailValueMono">{paper.ipfsHash}</span>
          </div>
          <div className="detailRow">
            <span className="detailLabel">Release Time</span>
            <span className="detailValue">
              {new Date(paper.releaseTimestamp * 1000).toLocaleString()}
            </span>
          </div>
          <div className="detailRow">
            <span className="detailLabel">Status</span>
            <CountdownTimer releaseTimestamp={paper.releaseTimestamp} />
          </div>
          <div className="detailRow">
            <span className="detailLabel">Uploaded By</span>
            <span className="detailValueMono">{paper.uploadedBy}</span>
          </div>
        </div>
      )}
    </div>
  );
}
