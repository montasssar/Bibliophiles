import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="homepage-container">
      <SearchBar
        value={query}
        onChange={handleQueryChange}
        onClear={handleClear}
        setIsFocused={setIsFocused}
      />

      {/* ✅ Brief Reads Section */}
      {!isFocused && (
        <div className="briefreads-section">
          <h2 className="briefreads-title">Brief Reads</h2>
          <BriefReads />
        </div>
      )}

      {isFocused && (
        <div className="recommendations">
          {loading && <p>Loading books...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && books.length > 0 && (
            <>
              <h2>Search Results</h2>
              <div className="book-grid">
                {books.map((book) => (
                  <div key={book.id} className="book-card">
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
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && books.length === 0 && query && (
            <p>No books found for “{query}”.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
