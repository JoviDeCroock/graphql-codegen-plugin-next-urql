import { Messages } from '../components/Messages';
import { Todos } from '../components/Todos';
import { getGetTodosNestedData, getGetMessagesData } from '../__generated__/graphql';

function Index() {
  return (
    <div>
      <Todos />
      <Messages />
    </div>
  );
}

export async function getServerSideProps() {
  const [todos, messages] = await Promise.all([getGetTodosNestedData(), getGetMessagesData()]);
  const props = {
    urqlState: {
      ...todos.props.urqlState,
      ...messages.props.urqlState,
    }
  }
  return { props }
}

export default Index
