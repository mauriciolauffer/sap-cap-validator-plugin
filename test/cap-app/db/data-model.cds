namespace validatorplugin.test.db;

using {
  cuid,
  managed,
  sap.common.CodeList
} from '@sap/cds/common';

entity CdsTypes : cuid, managed, CodeList {
  field_UUID        : UUID;
  field_Boolean     : Boolean;
  field_UInt8       : UInt8;
  field_Int16       : Int16;
  field_Int32       : Int32;
  field_Integer     : Integer;
  field_Int64       : Int64;
  field_Integer64   : Integer64;
  field_Decimal     : Decimal;
  field_Double      : Double;
  field_Date        : Date;
  field_Time        : Time;
  field_DateTime    : DateTime;
  field_Timestamp   : Timestamp;
  field_String      : String;
  field_Binary      : Binary;
  field_LargeBinary : LargeBinary;
  field_LargeString : LargeString;
};

entity ValidateTypes : cuid, managed, CodeList {
  something : String;
};

entity ValidateFormats : cuid, managed, CodeList {
  field_date                : String;
  field_time                : String;
  field_datetime            : String;
  field_isotime             : String;
  field_isodatetime         : String;
  field_duration            : String;
  field_uri                 : String;
  field_urireference        : String;
  field_uritemplate         : String;
  field_url                 : String;
  field_email               : String;
  field_hostname            : String;
  field_ipv4                : String;
  field_ipv6                : String;
  field_regex               : String;
  field_uuid                : String;
  field_jsonpointer         : String;
  field_relativejsonpointer : String;
  field_byte                : String;
  field_int32               : String;
  field_int64               : String;
  field_float               : String;
  field_double              : String;
  field_password            : String;
  field_binary              : String;
}

entity NoValidation : cuid, managed, CodeList {
  something : String;
}
