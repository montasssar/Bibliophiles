// src/pages/HomePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import BriefReads from '../components/BriefReads';
import './HomePage.css';

const HomePage = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (searchTerm) => {
    if (!searchTerm) return setBooks([]);

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}`
    );
    const data = await response.json();
    const bookItems = data.items?.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || 'Unknown',
      thumbnail: item.volumeInfo.imageLinks?.thumbnail,
      description: item.volumeInfo.description || 'No description available.',
    })) || [];

    setBooks(bookItems);
  };

  const handleRead = (book) => {
    navigate(`/book/${book.id}`, { state: { book } });
  };

  return (
    <div className="homepage-container">
      <SearchBar
        query={query}
        setQuery={setQuery}
        setIsFocused={setIsFocused}
        onSearch={handleSearch}
      />

      <BriefReads />

      {isFocused && books.length > 0 && (
        <div className="recommendations">
          <h2>Search Results</h2>
          <div className="book-grid">
            {books.map((book) => (
              <div key={book.id} className="book-card">
                {book.thumbnail && <img src={book.thumbnail} alt={book.title} />}
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <button className="read-btn" onClick={() => handleRead(book)}>
                  Read
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
