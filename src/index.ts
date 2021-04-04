import { PluginFunction, Types } from "@graphql-codegen/plugin-helpers";
import { LoadedFragment } from "@graphql-codegen/visitor-plugin-common";
import {
  FragmentDefinitionNode,
  GraphQLSchema,
  Kind,
  concatAST,
  visit,
  DocumentNode,
  print,
} from "graphql";

import { UrqlNextVisitor } from "./visitor";
import { UrqlNextPluginConfig } from "./config";

export const plugin: PluginFunction<
  UrqlNextPluginConfig,
  Types.ComplexPluginOutput
> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: UrqlNextPluginConfig
) => {
  const allAst = concatAST((documents.map((v) => v.document).filter(Boolean)) as DocumentNode[]);

  const allFragments: LoadedFragment[] = [
    ...(allAst.definitions.filter(
      (d) => d.kind === Kind.FRAGMENT_DEFINITION
    ) as FragmentDefinitionNode[]).map((fragmentDef) => ({
      node: fragmentDef,
      name: fragmentDef.name.value,
      onType: fragmentDef.typeCondition.name.value,
      isExternal: false,
    })),
  ];

  const visitor = new UrqlNextVisitor(
    schema,
    allFragments,
    config,
    documents
  );

  const visitorResult = visit(allAst, { leave: visitor });

  return {
    prepend: visitor.getImports(),
    content: [visitor.fragments, ...visitorResult.definitions.filter(t => typeof t === 'string')].join('\n'),
  };
};
