import { gql } from '@apollo/client';

export const GET_BRIEFREADS = gql`
  query GetBriefReads($filter: QuoteFilter) {
    quotes(filter: $filter) {
      id
      text
      author
    }
  }
`;

export const GET_RANDOM_BRIEFREADS = gql`
  query GetRandomBriefReads($limit: Int) {
    randomQuotes(limit: $limit) {
      id
      text
      author
    }
  }
`;
