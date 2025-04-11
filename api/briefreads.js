const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/api/briefreads', async (req, res) => {
  try {
    const limit = req.query.limit || 6;
    const response = await axios.get(`https://api.quotable.io/quotes?limit=${limit}`);

    const formattedQuotes = response.data.results.map((quote) => ({
      id: quote._id,
      text: quote.content,
      author: quote.author,
      lang: 'EN',
    }));

    res.json(formattedQuotes);
  } catch (error) {
    console.error('❌ Error fetching quotes:', error.message);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

module.exports = router;
