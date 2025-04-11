import React from 'react';
import '../styles/BriefReads.css';
import useQuotes from '../hooks/useQuotes';

const BriefReads = () => {
  const { quotes, loading, error } = useQuotes(6);

  if (loading) return <p className="brief-reads-title">Loading quotes...</p>;
  if (error) return <p className="brief-reads-title">{error}</p>;

  return (
    <div className="brief-reads-container">
      <h2 className="brief-reads-title">📚 Brief Reads</h2>
      <div className="quote-feed">
        {quotes.map((quote) => (
          <div key={quote.id} className={`quote-card ${quote.lang === 'AR' ? 'rtl' : ''}`}>
            <p className="quote-text">“{quote.text}”</p>
            <p className="quote-author">— {quote.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BriefReads;
