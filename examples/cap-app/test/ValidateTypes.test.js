import {describe, it, beforeAll} from 'vitest';
import supertest from 'supertest';

const cds = require('@sap/cds');
let request = {};
const endpoint = '/odata/v4/validator-plugin/ValidateTypes';
const defaults = {
  headers: {
    'content-type': 'application/json;IEEE754Compatible=true'
  }
};

describe('Testing CDS types with no validation', () => {
  beforeAll(() => {
    request = supertest.agent(cds.app)
        .set(defaults.headers);
  });

  it('Should return OK for entity built and served', async () => {
    await request
        .get(endpoint)
        .expect(200);
  });

  it('Should POST and return OK', async () => {
    const payload = {
      field: 'something'
    };
    await request
        .post(endpoint)
        .send(payload)
        .expect(201);
  });
});
