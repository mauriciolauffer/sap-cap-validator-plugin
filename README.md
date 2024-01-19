# SAP CAP Validator Plugin

[![npm](https://img.shields.io/npm/v/sap-cap-validator-plugin)](https://www.npmjs.com/package/sap-cap-validator-plugin) [![test](https://github.com/mauriciolauffer/sap-cap-validator-plugin/actions/workflows/test.yml/badge.svg)](https://github.com/mauriciolauffer/sap-cap-validator-plugin/actions/workflows/test.yml)

A [SAP CAP plugin](https://cap.cloud.sap/docs/node.js/cds-plugins) to validate incoming data.

This plugin uses [Ajv](https://www.npmjs.com/package/ajv), a [JSON schema](https://json-schema.org/) validator. All validation keywords available in `Ajv` (draft-07) can be used.

## Setup

All you need to do is to install the plugin and add the `@Validator` annotations to your entities.

### Installation

Install the plugin as an npm module:

```shell
npm install sap-cap-validator-plugin
```

### Annotation

The annotation tag is `@Validator`. You can add and combine valid rules from JSON Schema such as [types](https://ajv.js.org/json-schema.html) and [formats](https://ajv.js.org/packages/ajv-formats.html)

```js
using {myService as service} from './services';

annotate service.myEntity with {
  field_duration            @Validator: {format: 'duration'};
  field_uri                 @Validator: {format: 'uri'};
  field_url                 @Validator: {format: 'url'};
  field_email               @Validator: {format: 'email'};
  field_hostname            @Validator: {format: 'hostname'};
  field_ipv4                @Validator: {format: 'ipv4'};
  field_ipv6                @Validator: {format: 'ipv6'};
  field_datetime            @Validator: {
    type: 'string',
    format: 'date-time'
  };
};
```
