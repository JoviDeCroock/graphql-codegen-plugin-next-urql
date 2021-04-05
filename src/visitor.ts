import { Types } from "@graphql-codegen/plugin-helpers";
import { ClientSideBaseVisitor, LoadedFragment, DocumentMode } from "@graphql-codegen/visitor-plugin-common";

import { GraphQLSchema, OperationDefinitionNode } from "graphql";
import { UrqlNextPluginConfig } from "./config";

export class UrqlNextVisitor extends ClientSideBaseVisitor<
  UrqlNextPluginConfig,
  // @ts-ignore
  UrqlNextPluginConfig
> {
  imports: Set<string>;

  constructor(
    schema: GraphQLSchema,
    fragments: LoadedFragment[],
    config: UrqlNextPluginConfig,
    documents: Types.DocumentFile[]
  ) {
    super(schema, fragments, config, {});
    this._documents = documents;
    this.imports = new Set();
  }

  getImports(): string[] {
    this.imports.add(`import { initUrqlClient } from 'next-urql';`);
    this.imports.add(`import { dedupExchange, ssrExchange, cacheExchange, fetchExchange, gql } from '@urql/core';`);
    const baseImports = super.getImports();

    return [...baseImports.filter(x => !x.includes('graphql-tag')), ...Array.from(this.imports)];
  }

  _buildQuery(
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationResultType: string,
    operationVariablesTypes: string
  ): string {
    if (!node.name) return '';
    const operationName: string = this.convertName(node.name ? node.name.value : 'unnamed', {
      useTypesPrefix: false,
    });

    // TODO: we'll need some pattern to exclude certain client-only queries here
    if (node.operation !== 'query') return '';

    const getData = `export async function get${operationName}Data(
      variables?: Types.${operationVariablesTypes}
    ): Promise<{ props: { urqlState: { [key: string]: object } } }> {
      const ssrCache = ssrExchange({ isClient: false });
      const client = initUrqlClient({
        url: "http://localhost:3000/api/graphql",
        exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange]
      }, false);

      await client.query<Types.${operationResultType}>(${documentVariableName}, variables).toPromise();
    
      return { props: { urqlState: ssrCache.extractData() } };
    }`

    return getData;
  }

  buildOperation(
    node: OperationDefinitionNode,
    documentVariableName: string,
    _operationType: string,
    operationResultType: string,
    operationVariablesTypes: string
  ): string {
    return this._buildQuery(
      node,
      documentVariableName,
      operationResultType,
      operationVariablesTypes
    );
  }
}