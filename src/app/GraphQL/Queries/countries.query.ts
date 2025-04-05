import gql from 'graphql-tag';

export const GET_COUNTRIES = gql`
  query Countries($limit: Int!, $username: String!) {
    countries(limit: $limit, username: $username) {
      name
      population
      area
      densidad
    }
  }
`;