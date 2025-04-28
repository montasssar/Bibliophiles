const quoteController = require('../controllers/quoteController');

module.exports = {
  Query: {
    quotes: async (_, { filter }) => quoteController.fetchQuotes(filter),
    randomQuotes: async (_, { limit }) => quoteController.fetchRandomQuotes(limit),
  },
};
