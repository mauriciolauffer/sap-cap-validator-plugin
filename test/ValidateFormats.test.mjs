import { describe, it, beforeAll, expect } from 'vitest';
import supertest from 'supertest';

const cds = require('@sap/cds');
let request = {};
const endpoint = '/odata/v4/validator-plugin/ValidateFormats';
const defaults = {
  headers: {
    'content-type': 'application/json;IEEE754Compatible=true'
  }
};

describe('Testing formats validation', () => {
  beforeAll(() => {
    request = supertest.agent(cds.app)
      .set(defaults.headers);
  });

  it('Should return OK for entity built and served', async () => {
    await request
      .get(endpoint)
      .expect(200);
  });

  /* it('Should validate UUID format and return OK', async () => {
    const payload = {
      field_uuid: 'ff0db43c-1b55-45b9-be45-32b51c283eee'
    };
    await request
      // .post('http://localhost:4004/odata/v4/validator-plugin/ValidateFormats')
      .post(endpoint)
      .send(payload)
      .expect(201);
  }); */

  it('Should validate formats and return errors', async () => {
    const payload = {
      field_date: '2020-02-31',
      field_time: '22:59:60Z',
      field_datetime: '1998-12-31T23:59:61Z',
      field_isotime: '12:34:67',
      field_isodatetime: '2000-10-33T25:30:00.000-25:00',
      field_duration: 'invalid',
      field_uri: 'invalid',
      field_urireference: 'invalid',
      field_uritemplate: 'invalid',
      field_url: 'invalid',
      field_email: 'invalid',
      field_hostname: 'invalid@example.com',
      field_ipv4: 'invalid',
      field_ipv6: 'invalid',
      // field_regex: 'invalid',
      field_uuid: "invalid-uuid",
      // field_jsonpointer: null,
      // field_relativejsonpointer: null,
      field_byte: 'aGVsbG8gd29ybG=',
      /* field_int32: '256.1',
      field_int64: '256.1',
      field_float: 'invalid',
      field_double: 'invalid',
      field_password: 'false',
      field_binary: 'false' */
    };
    const response = await request
      .post(endpoint)
      .send(payload)
      .expect(400)
    const messages = JSON.parse(response.text);
    const details = messages?.error?.details;
    expect(details).toContainEqual(expect.objectContaining({ message: 'Payload invalid!' }));
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "date"',
      target: '/field_date'
    }));
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "time"',
      target: '/field_time'
    }));
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "date-time"',
      target: '/field_datetime'
    }));
    /* expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "iso-time"',
      target: '/field_isotime'
    })); */
    /* expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "iso-date-time"',
      target: '/field_isodatetime'
    })); */
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "duration"',
      target: '/field_duration'
    }));
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "uri"',
      target: '/field_uri'
    }));
    /* expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "uri-reference"',
      target: '/field_urireference'
    }));
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "uri-template"',
      target: '/field_uritemplate'
    })); */
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "url"',
      target: '/field_url'
    }));
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "email"',
      target: '/field_email'
    }));
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "hostname"',
      target: '/field_hostname'
    }));
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "ipv4"',
      target: '/field_ipv4'
    }));
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "ipv6"',
      target: '/field_ipv6'
    }));
    /* expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "regex"',
      target: '/field_regex'
    })); */
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "uuid"',
      target: '/field_uuid'
    }));
    /* expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "json-pointer"',
      target: '/field_jsonpointer'
    }));
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "relative-json-pointer"',
      target: '/field_relativejsonpointer'
    })); */
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "byte"',
      target: '/field_byte'
    }));
    /* expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "int32"',
      target: '/field_int32'
    }));
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "int64"',
      target: '/field_int64'
    }));
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "float"',
      target: '/field_float'
    }));
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "double"',
      target: '/field_double'
    }));
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "password"',
      target: '/field_password'
    }));
    expect(details).toContainEqual(expect.objectContaining({
      message: 'must match format "binary"',
      target: '/field_binary'
    })); */
  });
});
