import React, { useEffect } from 'react';
import { FaQuoteLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import useQuotes from '../hooks/useQuotes';
import useSavedBooks from '../hooks/useSavedBooks';
import '../styles/BriefReads.css';

const BriefReads = () => {
  const { quotes, loading, error, setPage, hasMore } = useQuotes();
  const { currentUser } = useAuth();
  const { isBookSaved, toggleSaveBook } = useSavedBooks(currentUser);

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (scrollBottom && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, setPage]);

  return (
    <div className="briefreads-container">
      {quotes.map((quote, index) => (
        <motion.div
          className="quote-card"
          key={quote.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <FaQuoteLeft className="quote-icon" />
          <p className="quote-text">“{quote.text}”</p>
          <span className="quote-author">— {quote.author}</span>
          <button
            className={`save-quote-btn ${isBookSaved(quote.id) ? 'saved' : ''}`}
            onClick={() =>
              toggleSaveBook({ ...quote, title: quote.text, author: quote.author })
            }
          >
            {isBookSaved(quote.id) ? '♥ Saved' : '♡ Save'}
          </button>
        </motion.div>
      ))}

      {loading && <p>Loading more quotes...</p>}
      {error && <p>{error}</p>}
      {!hasMore && <p>No more quotes to load.</p>}
    </div>
  );
};

export default BriefReads;
