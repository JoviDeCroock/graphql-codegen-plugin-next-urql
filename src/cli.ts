import sade from 'sade';
import glob from 'tiny-glob';
import { extractOperations } from './operations/extract';

const prog = sade('next-urql-graphql');

prog
  .version('0.0.1')
  .option('-c, --config', 'Provide path to custom config', 'foo.config.js');

prog
  .command('build <pages>')
  .describe('Build the source directory. Expects an `index.js` entry file.')
  .example('build app src/pages')
  .action(async (src) => {
    const files = await glob(`${src}/*.{js,jsx,tsx}`);
    await extractOperations(files);
  });

prog.parse(process.argv);
