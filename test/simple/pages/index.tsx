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

const MyPage = () => {
  useQuery({ query: TODOS_QUERY });
  return <p>hi</p>
}

export default MyPage;
