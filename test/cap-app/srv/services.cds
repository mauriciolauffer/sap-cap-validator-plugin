using {validatorplugin.test.db as db} from '../db/data-model';

service ValidatorPluginService {
  entity CdsTypes        as projection on db.CdsTypes;
  entity ValidateTypes   as projection on db.ValidateTypes;
  entity ValidateFormats as projection on db.ValidateFormats;
  entity NoValidation    as projection on db.NoValidation;
};
