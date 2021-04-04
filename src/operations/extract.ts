import { promises as fs } from 'fs';
import path from 'path';
import * as parser from '@babel/parser';
import generate from '@babel/generator';
import traverse from '@babel/traverse';

const visitFile = async (baseDir: string, file: string, queries: string[]) => {
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
  let i = 0;
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
    TaggedTemplateExpression(templatePath) {
      const tagPath = templatePath.get('tag');
      if (tagPath.node.name === 'gql' && tagPath.referencesImport('@urql/core')) {
        const graphqlQuery = generate(templatePath.get('quasi').node).code;

        // TODO: get parent to generate a cool name
        // TODO: check for unique operationName
        queries.push(`export const ${file}_query_${i++} = gql${graphqlQuery}`);
      }
    }
  });

  await Promise.all(imports.map(file => visitFile(baseDir, file, queries)));
}

export const extractOperations = async (baseDir: string, files: string[], write?: boolean): Promise<any> => {
  try {
    const results: { [file: string]: string } = {};

    for (const file of files) {
      const queries: string[] = [];
      await visitFile(baseDir, file, queries);
      console.log(`[Extraction] - ${file}`);
      console.log(`[Extraction] - ${queries.length}`);
      if (write) await fs.writeFile(path.resolve(process.cwd(), '__generated__', `${file}_queries.ts`), queries.join('\n'))
      console.log(`[Extraction] - Written ${file}_queries.ts`);
      results[`${file}_queries.ts`] = queries.join('\n');
    }

    return results;
  } catch (e) {
    console.log('ERROR', e);
  }
}