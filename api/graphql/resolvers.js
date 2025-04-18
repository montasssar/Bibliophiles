const axios = require('axios');
const { fetchQuoteGarden } = require('../proxyRouter');
const { retry } = require('../utils/retry');
const { normalizeAuthorName } = require('../utils/normalize');
const { shuffleArray } = require('../utils/shuffle');
require('dotenv').config();

const QUOTABLE_API = process.env.QUOTABLE_API;
const TYPEFIT_API = process.env.TYPEFIT_API;

module.exports = {
  Query: {
    quotes: async (_, { filter }) => {
      const limit = Math.min(filter?.limit || 6, 20);
      const page = filter?.page || 1;
      const sort = 'random';
      const tags = filter?.tag?.trim() || '';
      const rawAuthor = filter?.author?.trim() || '';
      const author = normalizeAuthorName(rawAuthor);
      let combinedQuotes = [];

      if (author) {
        const [quoteGardenData, quotableRes, typefitRes] = await Promise.allSettled([
          retry(() => fetchQuoteGarden(author, 50)),
          retry(() =>
            axios.get(`${QUOTABLE_API}/quotes`, {
              params: { limit, page, sort, author: encodeURIComponent(author) },
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
            axios.get(`${QUOTABLE_API}/quotes`, {
              params: { limit, page, sort, tags: encodeURIComponent(tags) },
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
          console.warn('❌ Tag filter failed:', err.message);
          combinedQuotes = [];
        }
      }

      return combinedQuotes;
    },

    randomQuotes: async (_, { limit = 6 }) => {
      const [quotableRes, typefitRes] = await Promise.allSettled([
        retry(() =>
          axios.get(`${QUOTABLE_API}/quotes`, {
            params: { limit: 100, sort: 'random' },
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

      return shuffleArray([...quotableQuotes, ...typefitQuotes]).slice(0, limit);
    },
  },
};
