import type {SchemaObject, ErrorObject} from 'ajv';
import type {ApplicationService, struct, entity, Service, log, Request} from '@sap/cds';
import type {LinkedDefinition, LinkedEntity} from '@sap/cds/apis/linked';
import type {EntityElements, Element} from '@sap/cds/apis/csn';

//import cds from '@sap/cds';
import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';

const ajv = new Ajv({allErrors: true});
ajvFormats(ajv);
const logger = globalThis.cds.log('validator-plugin');
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

/**
 * Builds schema to validate an entity. Ensures only the annotated fields are validated.
 */
function buildSchema(entity: LinkedEntity): SchemaObject {
  const schema = {
    $id: entity.name,
    $schema: 'http://json-schema.org/draft-07/schema',
    type: 'object',
    properties: {},
    // optionalProperties: {}, // JTD
    additionalProperties: true
  };
  for (const [key, elementProperties] of Object.entries(entity.elements)) {
    const schemaProperty = buildSchemaProperty(elementProperties);
    if (Object.keys(schemaProperty).length) {
      schema.properties[key] = schemaProperty;
      // schema.optionalProperties[key] = schemaProperty; // JTD
    }
  }
  logger.debug(schema);
  return schema;
}

/**
 * Build schema property from element properties
 */
function buildSchemaProperty(elementProperties: Element): SchemaObject {
  const property:SchemaObject = {};
  for (const [key, value] of Object.entries(elementProperties)) {
    if (isValidAnnotation(key)) {
      property.type = cdsTypeToAjvType.get(elementProperties.type);
      const tag = key.split('.')[1];
      if (tag) {
        property[tag] = value;
      }
    }
  }
  return property;
}

/**
 * Map AJV errors to CAP format to be used in req.error()
 */
function mapAjvToCdsErrors(ajvErrors: ErrorObject[]): Error[] {
  logger.debug('Validation errors:', ajvErrors?.length);
  const cdsError = [{
    code: 40099,
    message: 'Payload invalid!',
    target: '',
    status: 400
  }];
  for (const err of ajvErrors) {
    cdsError.push({
      code: 40099,
      message: err.message as string,
      target: err.instancePath,
      status: 400
    });
  }
  return cdsError;
}

/**
 * Get entity's annotated elements
 */
function getAnnotatedEntities(service: Service): LinkedEntity[] {
  const annotatedEntities:LinkedEntity[] = [];
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
 */
function hasAnnotatedElement(entityElements: EntityElements): boolean {
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
 */
function isElementAnnotated(elementProperties: Element): boolean {
  for (const key of Object.keys(elementProperties)) {
    if (isValidAnnotation(key)) {
      return true;
    }
  }
  return false;
}

/**
 * Check whether property is a valid annotation
 */
function isValidAnnotation(property: string): boolean {
  return regxpAnnotationTag.test(property);
}

/**
 * Register request handler
 */
function registerValidator(service: Service, entity: LinkedEntity) {
  logger.debug('Preparing validation schema to:', entity.name);
  const schema = buildSchema(entity);
  try {
    ajv.compile(schema);
    service.prepend(() => {
      service.before(VALIDATE_EVENTS, entity, requestHandler);
    });
  } catch (err) {
    logger.error(entity.name, 'schema is invalid! It will not be registered.');
    logger.error(schema);
  }
}

/**
 * Validator Request Handler
 */
function requestHandler(req: Request) {
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
globalThis.cds.once('served', async (services: Service[]) => {
  logger.debug('Starting validator plugin...');
  const annotatedServiceEntities = new Map();
  for (const service of services) {
    if (service.kind === 'app-service') {
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
  cdsTypeToAjvType.clear();
  annotatedServiceEntities.clear();
});

export default {getAnnotatedEntities, registerValidator};
