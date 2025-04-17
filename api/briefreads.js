const express = require('express');
const axios = require('axios');
const { fetchQuoteGarden } = require('./proxyRouter');
require('dotenv').config(); 

const router = express.Router();

const QUOTABLE_API = process.env.QUOTABLE_API;
const TYPEFIT_API = process.env.TYPEFIT_API;

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const normalizeAuthorName = (name) =>
  name
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const retry = async (fn, retries = 2, delay = 1000) => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Retry ${i + 1} failed:`, err.message);
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw lastError;
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

    if (author) {
      const [quoteGardenData, quotableRes, typefitRes] = await Promise.allSettled([
        retry(() => fetchQuoteGarden(author, 50)),
        retry(() =>
          axios.get(`${QUOTABLE_API}/quotes?limit=${limit}&page=${page}&sort=${sort}&author=${encodeURIComponent(author)}`, {
            timeout: 5000,
          })
        ),
        retry(() => axios.get(TYPEFIT_API, { timeout: 5000 })),
      ]);

      const quoteGardenQuotes =
        quoteGardenData.status === 'fulfilled'
          ? quoteGardenData.value.map((q, i) => ({
              id: `qg-${q._id || i}`,
              text: q.quoteText,
              author: q.quoteAuthor,
              lang: 'EN',
            }))
          : [];

      const quotableQuotes =
        quotableRes.status === 'fulfilled'
          ? quotableRes.value.data.results.map((q) => ({
              id: q._id,
              text: q.content,
              author: q.author,
              lang: 'EN',
            }))
          : [];

      const typefitQuotes =
        typefitRes.status === 'fulfilled'
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

    else if (tags) {
      try {
        const response = await retry(() =>
          axios.get(`${QUOTABLE_API}/quotes?limit=${limit}&page=${page}&sort=${sort}&tags=${encodeURIComponent(tags)}`, {
            timeout: 5000,
          })
        );
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

    else {
      const [quotableRes, typefitRes] = await Promise.allSettled([
        retry(() =>
          axios.get(`${QUOTABLE_API}/quotes?limit=${limit}&page=${page}&sort=${sort}`, {
            timeout: 5000,
          })
        ),
        retry(() => axios.get(TYPEFIT_API, { timeout: 5000 })),
      ]);

      const quotableQuotes =
        quotableRes.status === 'fulfilled'
          ? quotableRes.value.data.results.map((q) => ({
              id: q._id,
              text: q.content,
              author: q.author,
              lang: 'EN',
            }))
          : [];

      const typefitQuotes =
        typefitRes.status === 'fulfilled'
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

    return res.json(combinedQuotes);
  } catch (error) {
    console.error('❌ Final fallback error:', error.message || error);
    res.status(500).json({ error: 'Something went wrong while fetching quotes.' });
  }
});

module.exports = router;
