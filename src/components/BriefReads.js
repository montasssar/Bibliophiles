import React, { useState, useEffect } from 'react';
import { FaQuoteLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import useQuotes from '../hooks/useQuotes';
import useSavedBooks from '../hooks/useSavedBooks';
import '../styles/BriefReads.css';

const moods = [
  { label: 'All Moods', tag: '' },
  { label: 'Inspiration ✨', tag: 'inspirational' },
  { label: 'Philosophy 🧠', tag: 'wisdom|philosophy' },
  { label: 'Romantic 💘', tag: 'love|poetry' },
  { label: 'Literary 📚', tag: 'literature|truth' },
  { label: 'Life 🌱', tag: 'life|motivational' },
];

const mindsByTag = {
  inspirational: ['Maya Angelou', 'Oprah Winfrey', 'Steve Jobs', 'Brené Brown'],
  'wisdom|philosophy': ['Socrates', 'Nietzsche', 'Marcus Aurelius', 'Lao Tzu'],
  'love|poetry': ['Rumi', 'Pablo Neruda', 'Kahlil Gibran', 'Emily Dickinson'],
  'literature|truth': ['George Orwell', 'Toni Morrison', 'Franz Kafka', 'Jean-Paul Sartre'],
  'life|motivational': ['Helen Keller', 'Seneca', 'Eckhart Tolle', 'Thich Nhat Hanh'],
};

const BriefReads = () => {
  const { currentUser } = useAuth();
  const { isBookSaved, toggleSaveBook } = useSavedBooks(currentUser);

  const {
    quotes,
    loading,
    error,
    selectedTag,
    setSelectedTag,
    selectedAuthor,
    setSelectedAuthor,
    loadMore,
  } = useQuotes();

  const [typedAuthor, setTypedAuthor] = useState('');

  const suggestions = mindsByTag[selectedTag] || [];
  const filteredSuggestions = typedAuthor
    ? suggestions.filter((name) =>
        name.toLowerCase().includes(typedAuthor.toLowerCase())
      )
    : [];

  // Infinite scroll trigger
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !loading
      ) {
        loadMore();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, loadMore]);

  const handleAuthorSubmit = (e) => {
    if (e.key === 'Enter' && typedAuthor.trim()) {
      setSelectedAuthor(typedAuthor.trim());
    }
  };

  const clearAuthorInput = () => {
    setTypedAuthor('');
    setSelectedAuthor('');
  };

  const resetFilters = () => {
    setSelectedTag('');
    clearAuthorInput();
  };

  return (
    <div className="briefreads-container">
      <div className="mood-selector">
        <label htmlFor="mood-select">What’s your vibe?</label>
        <select
          id="mood-select"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          {moods.map((mood) => (
            <option key={mood.tag} value={mood.tag}>
              {mood.label}
            </option>
          ))}
        </select>
      </div>

      {selectedTag && (
        <div className="minds-intro-with-search" style={{ position: 'relative' }}>
          <p>
            ✨ <em>From minds like:</em>{' '}
            {suggestions.map((author, index) => (
              <span
                key={author}
                className="mind-link"
                onClick={() => {
                  setTypedAuthor(author);
                  setSelectedAuthor(author);
                }}
              >
                {author}
                {index < suggestions.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>

          <div className="custom-author-search">
            <input
              type="text"
              placeholder="Or type any author name..."
              value={typedAuthor}
              onChange={(e) => setTypedAuthor(e.target.value)}
              onKeyDown={handleAuthorSubmit}
            />

            {filteredSuggestions.length > 0 && (
              <ul className="author-suggestions">
                {filteredSuggestions.map((name) => (
                  <li
                    key={name}
                    onClick={() => {
                      setTypedAuthor(name);
                      setSelectedAuthor(name);
                    }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {(selectedAuthor || selectedTag) && (
        <div className="filter-banner">
          <p>
            {selectedAuthor && (
              <>
                🎤 Showing quotes from <strong>{selectedAuthor}</strong>
              </>
            )}
            <button className="reset-filters-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </p>
        </div>
      )}

      {quotes.length > 0 ? (
        quotes.map((quote, index) => (
          <motion.div
            className="quote-card"
            key={quote.id || `${quote.text}-${index}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <FaQuoteLeft className="quote-icon" />
            <p className="quote-text">“{quote.text}”</p>
            <span className="quote-author">— {quote.author}</span>

            <button
              className={`save-quote-btn ${isBookSaved(quote.id) ? 'saved' : ''}`}
              onClick={() =>
                toggleSaveBook({
                  ...quote,
                  title: quote.text,
                  author: quote.author,
                })
              }
            >
              {isBookSaved(quote.id) ? '♥ Saved' : '♡ Save'}
            </button>
          </motion.div>
        ))
      ) : (
        !loading && (
          <p>
            No quotes found for that author
            <br />
            Try selecting a mood from the dropdown above!
          </p>
        )
      )}

      {loading && <p className="loading-msg">Loading more quotes...</p>}
      {error && <p className="error">Something went wrong: {error.message}</p>}
    </div>
  );
};

export default BriefReads;
