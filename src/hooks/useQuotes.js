import { useEffect, useState } from 'react';
import axios from 'axios';

const useQuotes = (limit = 6) => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await axios.get(`/api/briefreads?limit=${limit}`);

        setQuotes(res.data);
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
