import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const useQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');

  const shownQuoteIdsRef = useRef(new Set());
  const lastAuthorsRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        hasMore &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  useEffect(() => {
    fetchQuotes(page, selectedTag, selectedAuthor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedTag, selectedAuthor]);

  const fetchQuotes = async (pg, tag = '', author = '') => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      let url = `/api/briefreads?limit=6&page=${pg}&sort=random`;
      if (tag) url += `&tags=${encodeURIComponent(tag)}`;
      if (author) url += `&author=${encodeURIComponent(author)}`;

      const res = await axios.get(url);
      const newQuotes = res.data || [];

      const uniqueNewQuotes = newQuotes.filter((q) => {
        const isNewId = !shownQuoteIdsRef.current.has(q.id);
        const isNewAuthor = !lastAuthorsRef.current.includes(q.author);
        return isNewId && isNewAuthor;
      });

      uniqueNewQuotes.forEach((q) => shownQuoteIdsRef.current.add(q.id));

      if (uniqueNewQuotes.length > 0) {
        const lastAuthor = uniqueNewQuotes[uniqueNewQuotes.length - 1].author;
        lastAuthorsRef.current.push(lastAuthor);
        if (lastAuthorsRef.current.length > 2) lastAuthorsRef.current.shift();
      }

      setQuotes((prev) => [...prev, ...uniqueNewQuotes]);
      setHasMore(newQuotes.length > 0);
      setError(null);
    } catch (err) {
      setHasMore(false);
      setError('Failed to load quotes. Please try again later.');
      console.warn(err); // less noisy than console.error
    } finally {
      setLoading(false);
    }
  };

  const handleMoodChange = (tag) => {
    setSelectedTag(tag);
    setSelectedAuthor('');
    resetState();
  };

  const handleAuthorSelect = (author) => {
    setSelectedAuthor(author);
    resetState();
  };

  const resetState = () => {
    setQuotes([]);
    setPage(1);
    setHasMore(true);
    shownQuoteIdsRef.current.clear();
    lastAuthorsRef.current = [];
    setError(null);
  };

  return {
    quotes,
    loading,
    error,
    hasMore,
    selectedTag,
    setSelectedTag: handleMoodChange,
    selectedAuthor,
    setSelectedAuthor: handleAuthorSelect,
  };
};

export default useQuotes;
