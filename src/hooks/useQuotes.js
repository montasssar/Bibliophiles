import { useEffect, useState, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_QUOTES, GET_RANDOM_QUOTES } from '../graphql/queries';

const useQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const shownQuoteIdsRef = useRef(new Set());
  const lastAuthorsRef = useRef([]);

  const [fetchQuotes] = useLazyQuery(GET_QUOTES, { fetchPolicy: 'no-cache' });
  const [fetchRandom] = useLazyQuery(GET_RANDOM_QUOTES, { fetchPolicy: 'no-cache' });

  const fetch = async (author, tag) => {
    try {
      const { data } = author
        ? await fetchQuotes({ variables: { filter: { author, limit: 6 } } })
        : await fetchRandom({ variables: { limit: 6 } });

      const incoming = data?.quotes || data?.randomQuotes || [];

      const unique = incoming.filter((q) => {
        const isNewId = !shownQuoteIdsRef.current.has(q.id);
        const isNewAuthor = !lastAuthorsRef.current.includes(q.author);
        return isNewId && isNewAuthor;
      });

      unique.forEach((q) => shownQuoteIdsRef.current.add(q.id));
      if (unique.length) {
        lastAuthorsRef.current.push(unique[unique.length - 1].author);
        if (lastAuthorsRef.current.length > 2) lastAuthorsRef.current.shift();
      }

      setQuotes(unique);
    } catch (err) {
      console.warn('GraphQL fetch failed:', err.message);
    }
  };

  useEffect(() => {
    fetch(selectedAuthor, selectedTag);
  }, [selectedAuthor, selectedTag]);

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
    shownQuoteIdsRef.current.clear();
    lastAuthorsRef.current = [];
  };

  return {
    quotes,
    selectedTag,
    setSelectedTag: handleMoodChange,
    selectedAuthor,
    setSelectedAuthor: handleAuthorSelect,
  };
};

export default useQuotes;
