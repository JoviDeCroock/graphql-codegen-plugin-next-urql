import { promises as fs } from 'fs';
import path from 'path';
import * as parser from '@babel/parser';
import generate from '@babel/generator';
import traverse from '@babel/traverse';

type CollectedQuery = {
  id: string;
  query: string;
  variables: string[];
}

const getFileName = (file) => {
  const fileParts = file.split(path.sep);
  return fileParts[fileParts.length - 1];
}

const visitFile = async (file: string, queries: CollectedQuery[]) => {
  const imports: string[] = [];

  const p = path.resolve(process.cwd(), file)
  const code = await fs.readFile(p, 'utf-8');

  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: [
      "typescript",
      "jsx",
    ],
  });

  traverse(ast, {
    ImportDeclaration(importPath) {
      const sourcePath = importPath.get('source');
      if (sourcePath.node.value.startsWith('.')) {
        const dir = path.dirname(p);
        // TODO: temp we need to scan the targetted directory adn find the used extension
        const resolvedImport = path.resolve(dir, sourcePath.node.value + '.tsx');
        imports.push(resolvedImport);
      }
    },
    CallExpression(expressionPath) {
      const calleePath = expressionPath.get('callee');
      if (calleePath.isIdentifier() && calleePath.node.name === 'useQuery') {
        const argumentsPath = expressionPath.get('arguments');
        if (argumentsPath && argumentsPath.every(x => x.isObjectExpression())) {
          const [nodePath] = argumentsPath;
          if (nodePath && nodePath.isObjectExpression()) {
            const queriesNode = nodePath.node.properties.find(obj => obj.key.name === 'query');
            const variablesNode = nodePath.node.properties.find(obj => obj.key.name === 'variables');

            if (queriesNode) {
              const name = queriesNode.value.name;
              const id = `${getFileName(file)}_query_${name}`;
    
              if (variablesNode) {
                const gatheredVariables = variablesNode.value.properties.map(x => x.key.name);
                const query = queries.find(q => q.id === id);
                if (query) {
                  query.variables = [...query.variables, ...gatheredVariables];
                }
              }
            }
          }
        }
      }
    },
    TaggedTemplateExpression(templatePath) {
      const tagPath = templatePath.get('tag');
      if (tagPath.isIdentifier() && tagPath.node.name === 'gql' && tagPath.referencesImport('@urql/core', 'gql')) {
        const graphqlQuery = generate(templatePath.get('quasi').node).code;

        let variableName;
        if (templatePath.parentPath.isVariableDeclarator()) {
          // @ts-ignore
          variableName = templatePath.parentPath.node.id.name;
        } else {
          // TODO: yikes
        }

        queries.push({
          id: `${getFileName(file)}_query_${variableName}`,
          query: `export const ${getFileName(file)}_query_${variableName} = gql${graphqlQuery}`,
          variables: [],
        });
      }
    }
  });

  await Promise.all(imports.map(file => visitFile(file, queries)));
}

export const extractOperations = async (files: string[], write?: boolean): Promise<any> => {
  try {
    const results: { [file: string]: string } = {};

    for (const file of files) {
      const queries: CollectedQuery[] = [];
      await visitFile(file, queries);
      console.log(`[Extraction] - ${file}`);
      console.log(`[Extraction] - ${queries.length}`);
      if (write) await fs.writeFile(path.resolve(process.cwd(), '__generated__', `${file}_queries.ts`), queries.join('\n'))
      console.log(`[Extraction] - Written ${file}_queries.ts`);
      results[`${getFileName(file)}_queries.ts`] = JSON.stringify(queries, undefined, 2);
    }

    return results;
  } catch (e) {
    console.log('ERROR', e);
  }
}