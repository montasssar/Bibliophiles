import { useEffect, useState, useRef, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_BRIEFREADS, GET_RANDOM_BRIEFREADS } from '../graphql/briefreadsQueries';

const useQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedTag, setSelectedTag] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');

  const shownQuoteIdsRef = useRef(new Set());
  const lastAuthorsRef = useRef([]);

  // ✅ Add error logging to both queries
  const [fetchQuotes] = useLazyQuery(GET_BRIEFREADS, {
    fetchPolicy: 'no-cache',
    onError: (error) => {
      console.error('❌ GET_BRIEFREADS error:', error);
    },
  });

  const [fetchRandom] = useLazyQuery(GET_RANDOM_BRIEFREADS, {
    fetchPolicy: 'no-cache',
    onError: (error) => {
      console.error('❌ GET_RANDOM_BRIEFREADS error:', error);
    },
  });

  const resetState = () => {
    setQuotes([]);
    setPage(1);
    shownQuoteIdsRef.current.clear();
    lastAuthorsRef.current = [];
    setError(null);
  };

  const fetch = useCallback(
    async (author, tag, pageNum = 1) => {
      setLoading(true);
      setError(null);

      try {
        let data;

        if (author || tag) {
          const filter = author ? { author, limit: 6, page: pageNum } : { tag, limit: 6, page: pageNum };
          const res = await fetchQuotes({ variables: { filter } });
          data = res.data?.quotes;
        } else {
          const res = await fetchRandom({ variables: { limit: 6 } }); // ✅ page removed
          data = res.data?.randomQuotes;
        }

        const incoming = data || [];

        const unique = incoming.filter((q) => {
          const isNewId = !shownQuoteIdsRef.current.has(q.id);
          const isNewAuthor = !lastAuthorsRef.current.includes(q.author);
          return isNewId && isNewAuthor;
        });

        unique.forEach((q) => shownQuoteIdsRef.current.add(q.id));

        if (unique.length) {
          const lastAuthor = unique[unique.length - 1].author;
          lastAuthorsRef.current.push(lastAuthor);
          if (lastAuthorsRef.current.length > 2) lastAuthorsRef.current.shift();
        }

        setQuotes((prev) => [...prev, ...unique]);
      } catch (err) {
        console.warn('⚠️ GraphQL fetch failed:', err.message);
        setError({ message: 'Could not load quotes. Please try again.' });
      } finally {
        setLoading(false);
      }
    },
    [fetchQuotes, fetchRandom]
  );

  useEffect(() => {
    resetState();
    fetch(selectedAuthor, selectedTag, 1);
  }, [selectedAuthor, selectedTag, fetch]);

  const loadMore = () => {
    const nextPage = page + 1;
    fetch(selectedAuthor, selectedTag, nextPage);
    setPage(nextPage);
  };

  const handleMoodChange = (tag) => {
    setSelectedTag(tag);
    setSelectedAuthor('');
  };

  const handleAuthorSelect = (author) => {
    setSelectedAuthor(author);
    setSelectedTag('');
  };

  return {
    quotes,
    loading,
    error,
    selectedTag,
    setSelectedTag: handleMoodChange,
    selectedAuthor,
    setSelectedAuthor: handleAuthorSelect,
    loadMore,
  };
};

export default useQuotes;
