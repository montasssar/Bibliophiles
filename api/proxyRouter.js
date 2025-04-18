const axios = require('axios');
require('dotenv').config();

const QUOTEGARDEN_API = process.env.QUOTEGARDEN_API;

const fetchQuoteGarden = async (author, limit = 50) => {
  if (!author) return [];

  try {
    const response = await axios.get(QUOTEGARDEN_API, {
      params: { author, limit },
      headers: { Accept: 'application/json' },
      timeout: 5000,
    });

    return response.data?.data || [];
  } catch (err) {
    console.warn('[GraphQL fetch] QuoteGarden failed:', err.message);
    return [];
  }
};

module.exports = { fetchQuoteGarden };
