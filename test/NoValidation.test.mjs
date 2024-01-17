import {describe, it, beforeAll} from 'vitest';
import supertest from 'supertest';

const cds = require('@sap/cds');
let request = {};
const defaults = {
  headers: {
    'content-type': 'application/json;IEEE754Compatible=true'
  }
};

describe('Testing entity with no validation', () => {
  beforeAll(() => {
    request = supertest.agent(cds.app)
        .set(defaults.headers);
  });

  it('Should return OK for entity built and served', async () => {
    await request
        .get('/odata/v4/validator-plugin/NoValidation')
        .expect(200);
  });
});