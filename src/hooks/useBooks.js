// src/hooks/useBooks.js
import { useState, useEffect } from 'react';

const useBooks = (category) => {
  const [books, setBooks] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStartIndex(Math.floor(Math.random() * 100));
    setBooks([]);
  }, [category]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${category}+arabic+english&startIndex=${startIndex}&maxResults=10`
        );
        const data = await res.json();
        setBooks((prev) => [...prev, ...(data.items || [])]);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [startIndex, category]);

  const loadMore = () => setStartIndex((prev) => prev + 10);

  return { books, loading, loadMore, setBooks };
};

export default useBooks;
