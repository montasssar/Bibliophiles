const express = require('express');
const axios = require('axios');

const router = express.Router();

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

router.get('/api/briefreads', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const page = req.query.page || 1;
    const sort = req.query.sort || 'random';
    const tags = req.query.tags || '';

    let combinedQuotes = [];

    if (!tags) {
      // Fetch from both sources if no tag filter is applied
      const quotableUrl = `https://api.quotable.io/quotes?limit=${limit}&page=${page}&sort=${sort}`;
      const typefitUrl = 'https://type.fit/api/quotes';

      const [quotableRes, typefitRes] = await Promise.allSettled([
        axios.get(quotableUrl),
        axios.get(typefitUrl),
      ]);

      const quotesFromQuotable = quotableRes.status === 'fulfilled'
        ? quotableRes.value.data.results.map((q) => ({
            id: q._id,
            text: q.content,
            author: q.author,
            lang: 'EN',
          }))
        : [];

      const quotesFromTypeFit = typefitRes.status === 'fulfilled'
        ? typefitRes.value.data
            .filter((q) => q.text && q.author)
            .slice(0, limit * 2)
            .map((t, index) => ({
              id: `typefit-${index}`,
              text: t.text,
              author: t.author || 'Unknown',
              lang: 'EN',
            }))
        : [];

      combinedQuotes = shuffleArray([...quotesFromQuotable, ...quotesFromTypeFit]).slice(0, limit);
    } else {
      // Only fetch from Quotable with tag filtering
      const quotableUrl = `https://api.quotable.io/quotes?limit=${limit}&page=${page}&sort=${sort}&tags=${encodeURIComponent(tags)}`;
      const response = await axios.get(quotableUrl);
      combinedQuotes = response.data.results.map((q) => ({
        id: q._id,
        text: q.content,
        author: q.author,
        lang: 'EN',
      }));
    }

    res.json(combinedQuotes);
  } catch (error) {
    console.error('❌ Error fetching quotes:', error?.response?.data || error.message || error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

module.exports = router;
