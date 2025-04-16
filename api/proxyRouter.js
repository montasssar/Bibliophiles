// ✅ Proxy Router for QuoteGarden - now used by /api/briefreads for direct precision calls

const express = require('express');
const axios = require('axios');

const proxyRouter = express.Router();

// Direct proxy for QuoteGarden (usable internally too)
proxyRouter.get('/proxy/quotegarden', async (req, res) => {
  const { author, limit = 10 } = req.query;

  if (!author) {
    return res.status(400).json({ error: 'Author name is required.' });
  }

  try {
    const response = await axios.get(
      'https://quote-garden.onrender.com/api/v3/quotes',
      {
        params: { author, limit },
        headers: { Accept: 'application/json' },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.warn('❌ QuoteGarden proxy failed:', err.message);
    res.status(500).json({ error: 'Proxy failed. Please try again.' });
  }
});

// Export to be used both as a standalone proxy and internally from /api/briefreads
const fetchQuoteGarden = async (author, limit = 50) => {
  try {
    const res = await axios.get('https://quote-garden.onrender.com/api/v3/quotes', {
      params: { author, limit },
      headers: { Accept: 'application/json' },
    });
    return res.data?.data || [];
  } catch (err) {
    console.warn('[internal call] QuoteGarden failed:', err.message);
    return [];
  }
};

module.exports = { proxyRouter, fetchQuoteGarden };
