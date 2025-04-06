// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import './HomePage.css';

// 🧪 Mock data for now (you'll later fetch from Firebase or another backend)
const mockBooks = [
  { id: 1, title: 'The Prophet', author: 'Kahlil Gibran', language: 'EN' },
  { id: 2, title: 'الأجنحة المتكسرة', author: 'جبران خليل جبران', language: 'AR' },
  { id: 3, title: 'Animal Farm', author: 'George Orwell', language: 'EN' },
  { id: 4, title: 'رجال في الشمس', author: 'غسان كنفاني', language: 'AR' },
  { id: 5, title: 'To Kill a Mockingbird', author: 'Harper Lee', language: 'EN' }
];

const HomePage = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState(mockBooks);

  useEffect(() => {
    const lowerQuery = query.toLowerCase();
    const results = mockBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery)
    );
    setFilteredBooks(results);
  }, [query]);

  return (
    <div className="homepage-container">
      <SearchBar query={query} setQuery={setQuery} setIsFocused={setIsFocused} />

      {isFocused && (
        <div className="recommendations">
          <h2>Recommended Books</h2>
          <div className="book-grid">
            {filteredBooks.map((book) => (
              <div key={book.id} className="book-card">
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <span className={`lang-tag ${book.language === 'AR' ? 'ar' : 'en'}`}>{book.language}</span>
                <button className="read-btn">Read</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
