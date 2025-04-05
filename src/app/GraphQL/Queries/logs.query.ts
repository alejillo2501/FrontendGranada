import gql from 'graphql-tag';

export const GET_LOGS = gql`
  query Logs($from: String!, $to: String!) {
    logs(from: $from, to: $to) {
      id
      username
      request_timestamp
      num_countries_returned
      countries_details
    }
  }
`;