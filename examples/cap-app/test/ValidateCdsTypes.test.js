import {describe, it, beforeAll, expect} from 'vitest';
import supertest from 'supertest';

const cds = require('@sap/cds');
let request = {};
const endpoint = '/odata/v4/validator-plugin/ValidateCdsTypes';
const defaults = {
  headers: {
    'content-type': 'application/json;IEEE754Compatible=true'
  }
};

describe('Testing CDS types validation', () => {
  beforeAll(() => {
    request = supertest.agent(cds.app)
        .set(defaults.headers);
  });

  it('Should return OK for entity built and served', async () => {
    await request
        .get(endpoint)
        .expect(200);
  });

  it('Should validate formats and return OK', async () => {
    const payload = {
      field_UUID: '3412101c-8f16-4d47-ad7d-eea71ec40dc6',
      field_Boolean: true,
      field_UInt8: 255,
      field_Int16: -32768,
      field_Int32: -2147483648,
      field_Integer: -1,
      field_Int64: -2,
      field_Integer64: -3,
      field_Decimal: 1.2,
      field_Double: 2.3,
      field_Date: '2000-12-31',
      field_Time: '12:34:56',
      field_DateTime: '2000-12-31T12:34:56Z',
      field_Timestamp: '2000-12-31T12:34:56Z',
      field_String: 'String',
      field_Binary: '10000000010000001001010000101101',
      field_LargeBinary: 'c29tZSBzdHJpbmcgdGV4dA==',
      field_LargeString: 'LargeString'
    };
    await request
        .post(endpoint)
        .send(payload)
        .expect(201);
  });

  it('Should validate formats and return errors', async () => {
    const payload = {
      field_UUID: 'UUID',
      field_Boolean: 'Boolean',
      field_UInt8: 'UInt8',
      field_Int16: 'Int16',
      field_Int32: 'Int32',
      field_Integer: 'Integer',
      field_Int64: 'Int64',
      field_Integer64: 'Integer64',
      field_Decimal: 'Decimal',
      field_Double: 'Double',
      field_Date: 'Date',
      field_Time: 'Time',
      field_DateTime: 'DateTime',
      field_Timestamp: 'Timestamp',
      field_String: 'String',
      field_Binary: 'Binary',
      field_LargeBinary: 'LargeBinary',
      field_LargeString: 'LargeString'
    };
    const response = await request
        .post(endpoint)
        .send(payload)
        .expect(400);
    const messages = JSON.parse(response.text);
    const details = messages?.error;
    expect(details).toMatchObject({
      message: expect.stringMatching(/^Deserialization Error/)
    });
  });
});
