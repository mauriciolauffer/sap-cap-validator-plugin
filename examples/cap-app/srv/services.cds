using {validatorplugin.test.db as db} from '../db/data-model';

service ValidatorPluginService {
  entity CdsTypes          as projection on db.CdsTypes;
  entity ValidateCdsTypes  as projection on db.ValidateCdsTypes;
  entity ValidateTypes     as projection on db.ValidateTypes;
  entity ValidateMediaType as projection on db.ValidateMediaType;
  entity ValidateFormats   as projection on db.ValidateFormats;
  entity NoValidation      as projection on db.NoValidation;
};
