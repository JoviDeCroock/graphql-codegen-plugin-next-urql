import { Todos } from '../components/Todos';
import { getGetTodosNestedData } from '../__generated__/graphql';

function Index() {
  return <Todos />
}

export async function getServerSideProps() {
  return await getGetTodosNestedData();
}

export default Index
