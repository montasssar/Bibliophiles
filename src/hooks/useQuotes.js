// src/hooks/useQuotes.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const useQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchQuotes = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await axios.get(`/api/briefreads?limit=6&page=${page}&sort=random`);
      const newQuotes = res.data;

      setQuotes((prev) => [...prev, ...newQuotes]);

      if (newQuotes.length < 6) {
        setHasMore(false);
      }
    } catch (err) {
      setError('Failed to load quotes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return { quotes, loading, error, setPage, hasMore };
};

export default useQuotes;
