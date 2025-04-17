const express = require('express');
const axios = require('axios');
require('dotenv').config();

const proxyRouter = express.Router();

const QUOTEGARDEN_API = process.env.QUOTEGARDEN_API;

proxyRouter.get('/proxy/quotegarden', async (req, res) => {
  const { author, limit = 10 } = req.query;

  if (!author) {
    return res.status(400).json({ error: 'Author name is required.' });
  }

  try {
    const response = await axios.get(QUOTEGARDEN_API, {
      params: { author, limit },
      headers: { Accept: 'application/json' },
    });
    res.json(response.data);
  } catch (err) {
    console.warn('❌ QuoteGarden proxy failed:', err.message);
    res.status(500).json({ error: 'Proxy failed. Please try again.' });
  }
});

const fetchQuoteGarden = async (author, limit = 50) => {
  try {
    const res = await axios.get(QUOTEGARDEN_API, {
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
