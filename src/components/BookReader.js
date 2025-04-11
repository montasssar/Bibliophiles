// src/pages/BookReader.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles//BookReader.css';

const BookReader = () => {
  const location = useLocation();
  const book = location.state?.book;

  if (!book) return <p>Book not found.</p>;

  return (
    <div className="book-reader-container">
      <h2>{book.title}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      {book.thumbnail && <img src={book.thumbnail} alt={book.title} />}
      <p>{book.description}</p>
      <a
        href={`https://books.google.com/books?id=${book.id}&printsec=frontcover&source=gbs_ge_summary_r&cad=0`}
        target="_blank"
        rel="noopener noreferrer"
        className="google-preview-link"
      >
        View on Google Books
      </a>
    </div>
  );
};

export default BookReader;
