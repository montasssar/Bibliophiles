import React, { useEffect } from 'react';
import useQuotes from '../hooks/useQuotes';
import '../styles/BriefReads.css';

const BriefReads = () => {
  const { quotes, loading, error, setPage, hasMore } = useQuotes();

  // ⬇️ Infinite Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (scrollBottom && hasMore && !loading) {
        setPage(prev => prev + 1); // Trigger fetch
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, setPage]);

  return (
    <div className="briefreads-container">
      {quotes.map((quote) => (
        <div className="quote-card" key={quote.id}>
          <p>{quote.text}</p>
          <span>— {quote.author}</span>
        </div>
      ))}

      {loading && <p>Loading more quotes...</p>}
      {error && <p>{error}</p>}
      {!hasMore && <p>No more quotes to load.</p>}
    </div>
  );
};

export default BriefReads;
