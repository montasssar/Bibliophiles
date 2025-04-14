import { useState, useEffect, useRef } from 'react';

const useBookSearch = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const searchBooks = (query) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!query.trim()) {
        setBooks([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();

        const bookItems = data.items?.map((item) => ({
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors?.[0] || 'Unknown',
          thumbnail: item.volumeInfo.imageLinks?.thumbnail,
          language: item.volumeInfo.language?.toUpperCase() || 'EN',
          description: item.volumeInfo.description || 'No description available.',
        })) || [];

        setBooks(bookItems);
      } catch (err) {
        setError('Something went wrong while searching.');
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  return { books, loading, error, searchBooks };
};

export default useBookSearch;
