import { Todos } from '../components/Todos';
import { getGetTodosNestedData } from '../components/Todos.generated';

function Index() {
  return <Todos />
}

export async function getServerSideProps() {
  return await getGetTodosNestedData();
}

export default Index
