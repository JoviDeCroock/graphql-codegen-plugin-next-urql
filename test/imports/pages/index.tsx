import { gql } from '@urql/core';
import { useQuery } from 'urql';
import { Todos } from '../components/Todos';

const CONFIG_QUERY = gql`
  query config {
    config {
      site_name
    }
  }
`;

const MyPage = () => {
  useQuery({ query: CONFIG_QUERY });
  return <Todos />
}

export default MyPage;
