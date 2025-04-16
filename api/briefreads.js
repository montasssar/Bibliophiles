// ✅ /api/briefreads route using fetchQuoteGarden utility

const express = require('express');
const axios = require('axios');
const { fetchQuoteGarden } = require('./proxyRouter');

const router = express.Router();

// Utility: Shuffle an array
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

// Utility: Normalize author name
const normalizeAuthorName = (name) => {
  return name
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

router.get('/api/briefreads', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 6, 20);
    const page = req.query.page || 1;
    const sort = req.query.sort || 'random';
    const tags = req.query.tags?.trim() || '';
    const rawAuthor = req.query.author?.trim() || '';
    const author = normalizeAuthorName(rawAuthor);

    let combinedQuotes = [];

    // CASE 1: Author search (use proxy-based internal fetch)
    if (author) {
      const [quoteGardenData, quotableRes, typefitRes] = await Promise.allSettled([
        fetchQuoteGarden(author, 50),
        axios.get(`https://api.quotable.io/quotes?limit=${limit}&page=${page}&sort=${sort}&author=${encodeURIComponent(author)}`),
        axios.get('https://type.fit/api/quotes'),
      ]);

      const quoteGardenQuotes = quoteGardenData.status === 'fulfilled'
        ? quoteGardenData.value.map((q, i) => ({
            id: `qg-${q._id || i}`,
            text: q.quoteText,
            author: q.quoteAuthor,
            lang: 'EN',
          }))
        : [];

      const quotableQuotes = quotableRes.status === 'fulfilled' && quotableRes.value.data?.results?.length
        ? quotableRes.value.data.results.map((q) => ({
            id: q._id,
            text: q.content,
            author: q.author,
            lang: 'EN',
          }))
        : [];

      const typefitQuotes = typefitRes.status === 'fulfilled'
        ? typefitRes.value.data
            .filter((q) => q.author?.toLowerCase().includes(author.toLowerCase()))
            .slice(0, limit * 2)
            .map((q, i) => ({
              id: `tf-${i}`,
              text: q.text,
              author: q.author || 'Unknown',
              lang: 'EN',
            }))
        : [];

      combinedQuotes = shuffleArray([
        ...quoteGardenQuotes,
        ...quotableQuotes,
        ...typefitQuotes,
      ]).slice(0, limit);
    }

    // CASE 2: Tag filtering (Quotable only)
    else if (tags) {
      try {
        const tagUrl = `https://api.quotable.io/quotes?limit=${limit}&page=${page}&sort=${sort}&tags=${encodeURIComponent(tags)}`;
        const response = await axios.get(tagUrl);
        combinedQuotes = response.data.results.map((q) => ({
          id: q._id,
          text: q.content,
          author: q.author,
          lang: 'EN',
        }));
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Tag filter failed:', err.message);
        }
        combinedQuotes = [];
      }
    }

    // CASE 3: No filters = random feed
    else {
      const [quotableRes, typefitRes] = await Promise.allSettled([
        axios.get(`https://api.quotable.io/quotes?limit=${limit}&page=${page}&sort=${sort}`),
        axios.get('https://type.fit/api/quotes'),
      ]);

      const quotableQuotes = quotableRes.status === 'fulfilled'
        ? quotableRes.value.data.results.map((q) => ({
            id: q._id,
            text: q.content,
            author: q.author,
            lang: 'EN',
          }))
        : [];

      const typefitQuotes = typefitRes.status === 'fulfilled'
        ? typefitRes.value.data
            .filter((q) => q.text && q.author)
            .slice(0, limit * 2)
            .map((q, i) => ({
              id: `tf-${i}`,
              text: q.text,
              author: q.author || 'Unknown',
              lang: 'EN',
            }))
        : [];

      combinedQuotes = shuffleArray([...quotableQuotes, ...typefitQuotes]).slice(0, limit);
    }

    // ✅ Always return an array — never fail visually
    return res.json(combinedQuotes);
  } catch (error) {
    console.error('❌ Server error:', error?.response?.data || error.message || error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

module.exports = router;
