import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import BriefReads from '../components/BriefReads'; 
import useBookSearch from '../hooks/useBookSearch';
import useSavedBooks from '../hooks/useSavedBooks';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const { books, loading, error, searchBooks } = useBookSearch();
  const { currentUser } = useAuth();
  const { isBookSaved, toggleSaveBook } = useSavedBooks(currentUser);
  const navigate = useNavigate();

  const handleQueryChange = (q) => {
    setQuery(q);
    setIsFocused(true);
    searchBooks(q);
  };

  const handleClear = () => {
    setQuery('');
    searchBooks('');
  };

  const handleRead = (book) => {
    navigate(`/book/${book.id}`, { state: { book } });
  };

  return (
    <main className="homepage-container">
      <motion.section
        className="search-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SearchBar
          value={query}
          onChange={handleQueryChange}
          onClear={handleClear}
          setIsFocused={setIsFocused}
        />
      </motion.section>

      {!isFocused && (
        <motion.section
          className="briefreads-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="briefreads-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Brief Reads
          </motion.h2>
          <BriefReads />
        </motion.section>
      )}

      {isFocused && (
        <motion.section
          className="recommendations"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {loading && <p>Loading books...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && books.length > 0 && (
            <>
              <h2 className="results-title">Search Results</h2>
              <div className="book-grid">
                {books.map((book, index) => (
                  <motion.div
                    key={book.id}
                    className="book-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    {book.thumbnail && (
                      <img src={book.thumbnail} alt={book.title} />
                    )}
                    <h3>{book.title}</h3>
                    <p><strong>Author:</strong> {book.author}</p>
                    <span className={`lang-tag ${book.language === 'AR' ? 'ar' : 'en'}`}>
                      {book.language}
                    </span>

                    <div className="book-actions">
                      <button className="read-btn" onClick={() => handleRead(book)}>
                        Read
                      </button>
                      <button
                        className={`save-btn ${isBookSaved(book.id) ? 'saved' : ''}`}
                        onClick={() => toggleSaveBook(book)}
                      >
                        {isBookSaved(book.id) ? '♥ Saved' : '♡ Save'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {!loading && books.length === 0 && query && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              No books found for “{query}”.
            </motion.p>
          )}
        </motion.section>
      )}
    </main>
  );
};

export default HomePage;
