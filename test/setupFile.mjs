import {beforeAll, afterAll} from 'vitest';

const cds = require('@sap/cds');
const serve = require('@sap/cds/bin/cds-serve');

beforeAll(async () => {
  await serve.exec('--port', '0', '--project', './test/cap-app');
});

afterAll(async () => {
  await cds.shutdown();
});
