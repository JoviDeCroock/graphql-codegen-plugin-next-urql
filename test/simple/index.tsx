import { gql } from '@urql/core';
import { useQuery } from 'urql';

const TODOS_QUERY = gql`
  query todos {
    todos {
      id
      title
    }
  }
`;

export const Todos = () => {
  useQuery({ query: TODOS_QUERY });
  return <p>hi</p>
}