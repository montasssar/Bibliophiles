import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const useQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState('');

  const shownQuoteIdsRef = useRef(new Set());

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        hasMore && !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  useEffect(() => {
    fetchQuotes(page, selectedTag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedTag]);

  const fetchQuotes = async (pg, tag = '') => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/briefreads?limit=6&page=${pg}&sort=random&tags=${tag}`);
      const newQuotes = res.data;

      const uniqueNewQuotes = newQuotes.filter((q) => !shownQuoteIdsRef.current.has(q.id));
      uniqueNewQuotes.forEach((q) => shownQuoteIdsRef.current.add(q.id));

      setQuotes((prev) => [...prev, ...uniqueNewQuotes]);

      // Always allow infinite scroll; do not force hasMore to false
      // Optionally: stop only if backend returns 0
      if (uniqueNewQuotes.length === 0) {
        setHasMore(false);
      }
    } catch (err) {
      setError('Failed to load quotes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodChange = (tag) => {
    setSelectedTag(tag);
    setQuotes([]);
    setPage(1);
    setHasMore(true);
    shownQuoteIdsRef.current.clear();
  };

  return {
    quotes,
    loading,
    error,
    hasMore,
    selectedTag,
    setSelectedTag: handleMoodChange,
  };
};

export default useQuotes;