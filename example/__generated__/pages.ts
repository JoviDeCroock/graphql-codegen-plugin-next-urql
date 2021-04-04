import * as Types from './graphql';

import { initUrqlClient } from 'next-urql';
import { dedupExchange, ssrExchange, cacheExchange, fetchExchange, gql } from '@urql/core';
export const TodoFieldsFragmentDoc = gql`
    fragment TodoFields on Todo {
  id
  text
}
    `;
export const GetMessagesDocument = gql`
    query getMessages {
  messages
}
    `;
export async function getGetMessagesData(
      variables?: Types.GetMessagesQueryVariables
    ): Promise<{ props: { urqlState: { [key: string]: object } } }> {
      const ssrCache = ssrExchange({ isClient: false });
      const client = initUrqlClient({
        url: "http://localhost:3000/api/graphql",
        exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange]
      }, false);

      await client.query<Types.GetMessagesQuery>(GetMessagesDocument, variables).toPromise();
    
      return { props: { urqlState: ssrCache.extractData() } };
    }
export const GetTodosNestedDocument = gql`
    query getTodosNested {
  todos {
    ...TodoFields
  }
}
    ${TodoFieldsFragmentDoc}`;
export async function getGetTodosNestedData(
      variables?: Types.GetTodosNestedQueryVariables
    ): Promise<{ props: { urqlState: { [key: string]: object } } }> {
      const ssrCache = ssrExchange({ isClient: false });
      const client = initUrqlClient({
        url: "http://localhost:3000/api/graphql",
        exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange]
      }, false);

      await client.query<Types.GetTodosNestedQuery>(GetTodosNestedDocument, variables).toPromise();
    
      return { props: { urqlState: ssrCache.extractData() } };
    }
export const GetTodosDocument = gql`
    query getTodos {
  todos {
    id
    text
  }
}
    `;
export async function getGetTodosData(
      variables?: Types.GetTodosQueryVariables
    ): Promise<{ props: { urqlState: { [key: string]: object } } }> {
      const ssrCache = ssrExchange({ isClient: false });
      const client = initUrqlClient({
        url: "http://localhost:3000/api/graphql",
        exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange]
      }, false);

      await client.query<Types.GetTodosQuery>(GetTodosDocument, variables).toPromise();
    
      return { props: { urqlState: ssrCache.extractData() } };
    }
export const GetTodosFragmentedDocument = gql`
    query getTodosFragmented {
  todos {
    ...TodoFields
  }
}
    ${TodoFieldsFragmentDoc}`;
export async function getGetTodosFragmentedData(
      variables?: Types.GetTodosFragmentedQueryVariables
    ): Promise<{ props: { urqlState: { [key: string]: object } } }> {
      const ssrCache = ssrExchange({ isClient: false });
      const client = initUrqlClient({
        url: "http://localhost:3000/api/graphql",
        exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange]
      }, false);

      await client.query<Types.GetTodosFragmentedQuery>(GetTodosFragmentedDocument, variables).toPromise();
    
      return { props: { urqlState: ssrCache.extractData() } };
    }