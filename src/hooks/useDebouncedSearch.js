import { useState, useEffect } from 'react';

const useDebouncedSearch = (query, delay = 400, callback) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      if (callback) callback(query);
    }, delay);

    return () => clearTimeout(handler);
  }, [query, delay, callback]);

  return debouncedQuery;
};

export default useDebouncedSearch;
