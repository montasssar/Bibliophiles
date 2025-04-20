const axios = require('axios');
const https = require('https');
const { retry } = require('./utils/retry');
const { normalizeAuthorName } = require('./utils/normalize');
const { shuffleArray } = require('./utils/shuffle');
require('dotenv').config();

const QUOTABLE_API = process.env.QUOTABLE_API;

// ⚠️ DEV ONLY: Bypass certificate errors locally
const agent = new https.Agent({ rejectUnauthorized: false });

const fetchQuotable = async (filter = {}) => {
  const limit = Math.min(filter?.limit || 6, 20);
  const page = filter?.page || 1;
  const sort = 'random';
  const tag = filter?.tag?.trim();
  const rawAuthor = filter?.author?.trim();
  const author = rawAuthor ? normalizeAuthorName(rawAuthor) : undefined;

  try {
    const response = await retry(() =>
      axios.get(`${QUOTABLE_API}/quotes`, {
        params: {
          limit,
          page,
          sort,
          author: author || undefined,
          tags: tag || undefined,
        },
        timeout: 5000,
        httpsAgent: agent, // 🔐 Temporary cert bypass
      })
    );

    return response.data.results.map((q) => ({
      id: q._id,
      text: q.content,
      author: q.author,
      lang: 'EN',
    }));
  } catch (err) {
    console.warn('❌ fetchQuotable failed:', err.message);
    return [];
  }
};

const fetchRandomQuotable = async (limit = 6) => {
  try {
    const response = await retry(() =>
      axios.get(`${QUOTABLE_API}/quotes`, {
        params: {
          limit: 100,
          sort: 'random',
        },
        timeout: 5000,
        httpsAgent: agent, // 🔐 Temporary cert bypass
      })
    );

    return shuffleArray(
      response.data.results.map((q) => ({
        id: q._id,
        text: q.content,
        author: q.author,
        lang: 'EN',
      }))
    ).slice(0, limit);
  } catch (err) {
    console.warn('❌ fetchRandomQuotable failed:', err.message);
    return [];
  }
};

module.exports = {
  fetchQuotable,
  fetchRandomQuotable,
};
