const {
  fetchQuotable,
  fetchRandomQuotable,
} = require('../proxyRouter');

module.exports = {
  Query: {
    quotes: async (_, { filter }) => fetchQuotable(filter),
    randomQuotes: async (_, { limit }) => fetchRandomQuotable(limit),
  },
};
