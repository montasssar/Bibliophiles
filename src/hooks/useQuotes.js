import { useEffect, useState, useRef, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_BRIEFREADS, GET_RANDOM_BRIEFREADS } from '../graphql/briefreadsQueries';

const useQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedTag, setSelectedTag] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');

  const shownQuoteIdsRef = useRef(new Set());
  const lastAuthorsRef = useRef([]);

  const [fetchQuotes] = useLazyQuery(GET_BRIEFREADS, { fetchPolicy: 'no-cache' });
  const [fetchRandom] = useLazyQuery(GET_RANDOM_BRIEFREADS, { fetchPolicy: 'no-cache' });

  const resetState = () => {
    setQuotes([]);
    shownQuoteIdsRef.current.clear();
    lastAuthorsRef.current = [];
    setError(null);
  };

  const fetch = useCallback(
    async (author, tag) => {
      setLoading(true);
      setError(null);

      try {
        const variables = author
          ? { filter: { author, limit: 6 } }
          : tag
          ? { filter: { tag, limit: 6 } }
          : null;

        const { data } = variables
          ? await fetchQuotes({ variables })
          : await fetchRandom({ variables: { limit: 6 } });

        const incoming = data?.quotes || data?.randomQuotes || [];

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

        setQuotes(unique);
      } catch (err) {
        console.warn('GraphQL fetch failed:', err.message);
        setError({ message: 'Could not load quotes. Please try again.' });
      } finally {
        setLoading(false);
      }
    },
    [fetchQuotes, fetchRandom]
  );

  useEffect(() => {
    fetch(selectedAuthor, selectedTag);
  }, [selectedAuthor, selectedTag, fetch]);

  const handleMoodChange = (tag) => {
    setSelectedTag(tag);
    setSelectedAuthor('');
    resetState();
  };

  const handleAuthorSelect = (author) => {
    setSelectedAuthor(author);
    resetState();
  };

  return {
    quotes,
    loading,
    error,
    selectedTag,
    setSelectedTag: handleMoodChange,
    selectedAuthor,
    setSelectedAuthor: handleAuthorSelect,
  };
};

export default useQuotes;
