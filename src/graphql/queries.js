import { gql } from '@apollo/client';

export const GET_QUOTES = gql`
  query GetQuotes($filter: QuoteFilter) {
    quotes(filter: $filter) {
      id
      text
      author
    }
  }
`;

export const GET_RANDOM_QUOTES = gql`
  query GetRandomQuotes($limit: Int) {
    randomQuotes(limit: $limit) {
      id
      text
      author
    }
  }
`;