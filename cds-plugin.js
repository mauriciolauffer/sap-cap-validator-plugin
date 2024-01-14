'use strict';

// const cds = require('@sap/cds');
// const xxAjv = require('ajv/dist/jtd');
const Ajv = require('ajv/dist/2019');
// const Ajv = require('ajv');
const ajvFormats = require('ajv-formats');
const ajv = new Ajv({allErrors: true});
// const format = require('ajv/dist/vocabularies/format/format');
// ajv.addKeyword('format');
ajvFormats(ajv);
const logger = cds.log('validator-plugin');
const VALIDATE_EVENTS = ['CREATE', 'UPDATE'];
let regxpAnnotationTag = new RegExp(`^@Validator.`);
const cdsTypeToAjvType = new Map([
  ['cds.UUID', 'string'],
  ['cds.Boolean', 'boolean'],
  ['cds.UInt8', 'uint8'],
  ['cds.Int16', 'int16'],
  ['cds.Int32', 'int32'],
  ['cds.Integer', 'string'],
  ['cds.Int64', 'int64'],
  ['cds.Integer64', 'string'],
  ['cds.Decimal', 'string'],
  ['cds.Double', 'string'],
  ['cds.Date', 'date'],
  ['cds.Time', 'time'],
  ['cds.DateTime', 'string'],
  ['cds.Timestamp', 'timestamp'],
  ['cds.String', 'string'],
  ['cds.Binary', 'string'],
  ['cds.LargeBinary', 'string'],
  ['cds.LargeString', 'string']
]);

const cdsTypeToAjvFormat = new Map([
  ['cds.UUID', 'uuid'],
  ['cds.Int32', 'int32'],
  ['cds.Int64', 'int64'],
  ['cds.Decimal', 'double'],
  ['cds.Double', 'double'],
  ['cds.Date', 'date'],
  ['cds.Time', 'time'],
  ['cds.DateTime', 'date-time'],
  ['cds.Binary', 'binary'],
  ['cds.LargeBinary', 'binary']
]);

cds.log('validator-plugin', 'debug'); // TODO: remove it

/**
 * Builds schema to validate an entity. Ensures only the annotated fields are validated.
 * @param {object[]} entityElements
 * @returns {Ajv.SchemaObject}
 */
function buildSchema(entityElements) {
  const schema = {
    type: 'object',
    properties: {},
    // optionalProperties: {},
    additionalProperties: true
  };
  for (const [key, elementProperties] of Object.entries(entityElements)) {
    const schemaProperty = buildSchemaProperty(elementProperties);
    if (Object.keys(schemaProperty).length) {
      schema.properties[key] = schemaProperty;
      // schema.optionalProperties[key] = schemaProperty;
    }
  }
  logger.debug(schema);
  return schema;
}

/**
 * Build schema property from element properties
 * @param {object} elementProperties
 * @returns {object}
 */
function buildSchemaProperty(elementProperties) {
  const property = {};
  for (const [key, value] of Object.entries(elementProperties)) {
    if (isValidAnnotation(key)) {
      property.type = cdsTypeToAjvType.get(elementProperties.type);
      const tag = key.split('.')[1];
      if (tag) {
        property[tag] = value;
      }
      /* if (tag === 'format') {
        property.metadata = {
          format: value
        };
        // property.xxxxxxxx = true;
      } else if (tag) {
        property[tag] = value;
      } */
    }
  }
  return property;
}

/**
 * Map AJV errors to CAP format to be used in req.error()
 * @param {object[]} ajvErrors
 * @returns {object[]}
 */
function mapAjvToCdsErrors(ajvErrors) {
  logger.debug('Validation errors:', ajvErrors?.length);
  const cdsError = [{
    code: 40099,
    message: 'Payload invalid!',
    status: 400
  }];
  for (const err of ajvErrors) {
    cdsError.push({
      code: 40099,
      message: err.message,
      target: err.instancePath,
      status: 400
    });
  }
  return cdsError;
}

/**
 * Get entity's annotated elements
 * @param {object} service
 * @returns {object[]}
 */
function getAnnotatedEntities(service) {
  const annotatedEntities = [];
  for (const entity of service.entities) {
    logger.debug('Looking for annotations in:', entity.name);
    if (hasAnnotatedElement(entity.elements)) {
      annotatedEntities.push(entity);
    }
  }
  return annotatedEntities;
}

/**
 * Check whether entity has annotated elements
 * @param {object} entityElements
 * @returns {boolean}
 */
function hasAnnotatedElement(entityElements) {
  for (const [key, elementProperties] of Object.entries(entityElements)) {
    if (isElementAnnotated(elementProperties)) {
      logger.debug('Annotation found in:', key);
      return true;
    }
  }
  return false;
}

/**
 * Check whether entity element is annotated
 * @param {object} elementProperties
 * @returns {boolean}
 */
function isElementAnnotated(elementProperties) {
  for (const key of Object.keys(elementProperties)) {
    if (isValidAnnotation(key)) {
      return true;
    }
  }
  return false;
}

/**
 * Check whether property is a valid annotation
 * @param {string} property
 * @returns {boolean}
 */
function isValidAnnotation(property) {
  return regxpAnnotationTag.test(property);
}

/**
 * Register request handler
 * @param {cds.ApplicationService} service
 * @param {cds.ApplicationService} entity
 */
function registerValidator(service, entity) {
  logger.debug('Preparing validation schema to:', entity.name);
  const schema = buildSchema(entity.elements);
  if (!ajv.validateSchema(schema)) {
    logger.error(entity.name, 'schema is invalid! It will not be registered.');
    return;
  }
  ajv.addSchema(schema, entity.name);
  service.prepend(() => {
    service.before(VALIDATE_EVENTS, entity, requestHandler);
  });
}

/**
 * Validator Request Handler
 * @param {cds.Request} req
 */
function requestHandler(req) {
  logger.debug('Validating request to:', req.entity);
  const validate = ajv.getSchema(req.entity);
  if (!validate(req.data)) {
    for (const err of mapAjvToCdsErrors(validate.errors)) {
      req.error(err);
    }
  }
}

/**
 * Event triggered when all CDS services are served. Validator middleware will be registered.
 */
cds.once('served', async (services) => {
  logger.debug('Starting validator plugin...');
  const annotatedServiceEntities = new Map();
  for (const service of services) {
    if (service instanceof cds.ApplicationService) {
      annotatedServiceEntities.set(service, getAnnotatedEntities(service));
    }
  }
  if (annotatedServiceEntities.size === 0) {
    logger.debug('No annotations found. Validator will not process any request.');
  }
  for (const [service, entities] of annotatedServiceEntities) {
    for (const entity of entities) {
      registerValidator(service, entity);
    }
  }
  regxpAnnotationTag = null;
  // cdsTypeToAjvType.clear();
  annotatedServiceEntities.clear();
});
