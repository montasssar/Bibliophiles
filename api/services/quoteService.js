const axios = require('axios');
const https = require('https');
const { retry } = require('../utils/retry');
const { normalizeAuthorName } = require('../utils/normalize');
const { shuffleArray } = require('../utils/shuffle');
const localQuotes = require('../data/quotes.json');
require('dotenv').config();

const QUOTABLE_API = process.env.QUOTABLE_API;
const agent = new https.Agent({ rejectUnauthorized: false });

// 🔄 Normalize API responses
const transformQuotes = (results, source = 'quotable') =>
  results.map((q) => ({
    id: source === 'quotable' ? q._id : q._id || q.id || q.quoteLink,
    text: source === 'quotable' ? q.content : q.quoteText || q.text,
    author: q.author || 'Unknown',
    lang: 'EN',
  }));

// 📦 Fallback from local quotes if API fails
const fallbackFilteredQuotes = (filter, limit) => {
  let filtered = localQuotes;

  if (filter.author) {
    filtered = filtered.filter((q) =>
      q.author.toLowerCase().includes(filter.author.toLowerCase())
    );
  }

  if (filter.tag) {
    filtered = filtered.filter((q) =>
      q.text.toLowerCase().includes(filter.tag.toLowerCase())
    );
  }

  return shuffleArray(filtered).slice(0, limit);
};

// 🚀 Get quotes with optional filters
exports.getFilteredQuotes = async (filter = {}) => {
  const limit = Math.min(filter?.limit || 6, 20);
  const page = filter?.page || 1;
  const tag = filter?.tag?.trim();
  const rawAuthor = filter?.author?.trim();
  const author = rawAuthor ? normalizeAuthorName(rawAuthor) : undefined;

  try {
    const response = await retry(() =>
      axios.get(`${QUOTABLE_API}/quotes`, {
        params: { limit, page, sort: 'random', tags: tag || undefined, author },
        timeout: 5000,
        httpsAgent: agent,
      })
    );

    const quotes = transformQuotes(response.data.results);
    if (quotes.length) {
      console.log(`✅ Fetched ${quotes.length} quotes from API.`);
      return quotes;
    }
    throw new Error('Empty API response');
  } catch (err) {
    console.warn('❌ API failed, using local fallback quotes.');
    return fallbackFilteredQuotes({ author, tag }, limit);
  }
};

// 🎲 Get random quotes
exports.getRandomQuotes = async (limit = 6) => {
  try {
    const response = await retry(() =>
      axios.get(`${QUOTABLE_API}/quotes`, {
        params: { limit: 100, sort: 'random' },
        timeout: 5000,
        httpsAgent: agent,
      })
    );

    const quotes = transformQuotes(response.data.results);
    if (quotes.length) {
      console.log(`✅ Fetched ${quotes.length} random quotes from API.`);
      return shuffleArray(quotes).slice(0, limit);
    }
    throw new Error('Empty API response');
  } catch (err) {
    console.warn('❌ API failed, using local fallback quotes.');
    return shuffleArray(localQuotes).slice(0, limit);
  }
};
