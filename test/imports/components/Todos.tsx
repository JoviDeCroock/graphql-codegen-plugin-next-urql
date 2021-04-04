import { gql } from '@urql/core';
import { useQuery } from 'urql';

const TODOS_QUERY = gql`
  query todos ($from: Int) {
    todos (from: $from, limit: 10) {
      id
      title
    }
  }
`;

export const Todos = () => {
  useQuery({ query: TODOS_QUERY, variables: { from: 0 } });
  return <p>hi</p>
}