const { gql } = require('apollo-server-express');

module.exports = gql`
  type Quote {
    id: ID
    text: String
    author: String
    lang: String
  }

  input QuoteFilter {
    author: String
    tag: String
    limit: Int
    page: Int
  }

  type Query {
    quotes(filter: QuoteFilter): [Quote]
    randomQuotes(limit: Int): [Quote]
  }
`;
