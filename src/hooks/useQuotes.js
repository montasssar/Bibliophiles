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
  const lastAuthorsRef = useRef([]); // Track last 2 authors

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
      const newQuotes = res.data;

      // Filter out duplicates and authors in last 2
      const uniqueNewQuotes = newQuotes.filter((q) => {
        const isNewId = !shownQuoteIdsRef.current.has(q.id);
        const isNewAuthor = !lastAuthorsRef.current.includes(q.author);
        return isNewId && isNewAuthor;
      });

      uniqueNewQuotes.forEach((q) => shownQuoteIdsRef.current.add(q.id));

      if (uniqueNewQuotes.length > 0) {
        const lastAuthor = uniqueNewQuotes[uniqueNewQuotes.length - 1].author;
        lastAuthorsRef.current.push(lastAuthor);
        if (lastAuthorsRef.current.length > 2) {
          lastAuthorsRef.current.shift();
        }
      }

      setQuotes((prev) => [...prev, ...uniqueNewQuotes]);

      // Only stop if the backend gives nothing new at all
      if (newQuotes.length === 0) {
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
    setSelectedAuthor('');
    setQuotes([]);
    setPage(1);
    setHasMore(true);
    shownQuoteIdsRef.current.clear();
    lastAuthorsRef.current = [];
  };

  const handleAuthorSelect = (author) => {
    setSelectedAuthor(author);
    setQuotes([]);
    setPage(1);
    setHasMore(true);
    shownQuoteIdsRef.current.clear();
    lastAuthorsRef.current = [];
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