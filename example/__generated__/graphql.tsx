import { initUrqlClient } from 'next-urql';
import { dedupExchange, ssrExchange, cacheExchange, fetchExchange, gql } from '@urql/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};


export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type Mutation = {
  __typename?: 'Mutation';
  toggleTodo?: Maybe<Todo>;
};


export type MutationToggleTodoArgs = {
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  todos?: Maybe<Array<Maybe<Todo>>>;
};

export type Todo = {
  __typename?: 'Todo';
  id?: Maybe<Scalars['ID']>;
  text?: Maybe<Scalars['String']>;
  complete?: Maybe<Scalars['Boolean']>;
};


export type TodoFieldsFragment = (
  { __typename?: 'Todo' }
  & Pick<Todo, 'id' | 'text'>
);

export type GetTodosQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTodosQuery = (
  { __typename?: 'Query' }
  & { todos?: Maybe<Array<Maybe<(
    { __typename?: 'Todo' }
    & Pick<Todo, 'id' | 'text'>
  )>>> }
);

export type GetTodosFragmentedQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTodosFragmentedQuery = (
  { __typename?: 'Query' }
  & { todos?: Maybe<Array<Maybe<(
    { __typename?: 'Todo' }
    & TodoFieldsFragment
  )>>> }
);

export const GetTodosDocument = gql`
    query getTodos {
  todos {
    id
    text
  }
}
    `;

console.log(GetTodosDocument.__key)
export async function getGetTodosData(
      variables?: GetTodosQueryVariables
    ): Promise<object> {
      const ssrCache = ssrExchange({ isClient: false });
      const client = initUrqlClient({
        url: "http://localhost:3000/api/graphql",
        exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange]
      }, false);

      await client.query<GetTodosQuery>(GetTodosDocument, variables).toPromise();
    
      return { props: { urqlState: ssrCache.extractData() } };
    }
    const TodoFieldsFragmentDoc = gql`
    fragment TodoFields on Todo {
      id
      text
    }
  `;
export const GetTodosFragmentedDocument = gql`
    query getTodosFragmented {
  todos {
    ...TodoFields
  }
}
    ${TodoFieldsFragmentDoc}`; // TODO: this variable is not decalred yet
export async function getGetTodosFragmentedData(
      variables?: GetTodosFragmentedQueryVariables
    ): Promise<object> {
      const ssrCache = ssrExchange({ isClient: false });
      const client = initUrqlClient({
        url: "http://localhost:3000/api/graphql",
        exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange]
      }, false);

      await client.query<GetTodosFragmentedQuery>(GetTodosFragmentedDocument, variables).toPromise();
    
      return { props: { urqlState: ssrCache.extractData() } };
    }