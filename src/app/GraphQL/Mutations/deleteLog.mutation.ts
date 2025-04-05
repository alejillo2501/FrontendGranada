import gql from 'graphql-tag';

export const DELETE_LOG = gql`
  mutation DeleteLog($id: Int!) {
    deleteLog(id: $id) {
      id
      username
      request_timestamp
      num_countries_returned
      countries_details
    }
  }
`;