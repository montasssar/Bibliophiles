import { useEffect, useState } from 'react';
import axios from 'axios';

const useQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // To know when to stop

  const fetchQuotes = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await axios.get(`/api/briefreads?limit=6&page=${page}`);
      const newQuotes = res.data;

      setQuotes((prev) => [...prev, ...newQuotes]);

      // If fewer than expected, no more to load
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
  }, [page]); // Triggers when page increases

  return { quotes, loading, error, setPage, hasMore };
};

export default useQuotes;
