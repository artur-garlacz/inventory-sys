/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require('path');

require('esbuild')
  .build({
    bundle: true,
    entryPoints: [join(__dirname, '/src/index.ts')],
    outfile: join(__dirname, '/dist/index.js'),
    platform: 'node',
    external: ['@aws-sdk/*', 'aws-lambda'],
    plugins: [],
    logLevel: 'info'
  })
  .catch(() => {
    process.exit(1);
  });
