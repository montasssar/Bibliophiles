const { getFilteredQuotes, getRandomQuotes } = require('../services/quoteService');

exports.fetchQuotes = async (filter) => {
  return await getFilteredQuotes(filter);
};

exports.fetchRandomQuotes = async (limit) => {
  return await getRandomQuotes(limit);
};
