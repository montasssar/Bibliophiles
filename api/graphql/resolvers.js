const axios = require('axios');
const { retry } = require('../utils/retry');
const { normalizeAuthorName } = require('../utils/normalize');
const { shuffleArray } = require('../utils/shuffle');
require('dotenv').config();

const QUOTABLE_API = process.env.QUOTABLE_API;

module.exports = {
  Query: {
    quotes: async (_, { filter }) => {
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
          })
        );

        return response.data.results.map((q) => ({
          id: q._id,
          text: q.content,
          author: q.author,
          lang: 'EN',
        }));
      } catch (err) {
        console.warn('❌ Failed to fetch quotes:', err.message);
        return [];
      }
    },

    randomQuotes: async (_, { limit = 6 }) => {
      try {
        const response = await retry(() =>
          axios.get(`${QUOTABLE_API}/quotes`, {
            params: { limit: 100, sort: 'random' },
            timeout: 5000,
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
        console.warn('❌ Failed to fetch random quotes:', err.message);
        return [];
      }
    },
  },
};
