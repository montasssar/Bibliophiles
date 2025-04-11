// src/hooks/useQuotes.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const useQuotes = (limit = 6) => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await axios.get(`https://api.quotable.io/quotes?limit=${limit}`);
        const formatted = res.data.results.map((quote) => ({
          id: quote._id,
          text: quote.content,
          author: quote.author,
          lang: 'EN', // All quotes from Quotable are in English
        }));
        setQuotes(formatted);
      } catch (err) {
        setError('Failed to load quotes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [limit]);

  return { quotes, loading, error };
};

export default useQuotes;
