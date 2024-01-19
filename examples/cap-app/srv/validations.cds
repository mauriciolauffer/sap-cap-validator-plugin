using {ValidatorPluginService as service} from './services';

annotate service.CdsTypes with {
  field_UUID        @Validator  @odata: {
    Type: 'Edm.GeometryPolygon',
    SRID: 0
  };
  field_Boolean     @Validator;
  field_UInt8       @Validator;
  field_Int16       @Validator;
  field_Int32       @Validator;
  field_Integer     @Validator;
  field_Int64       @Validator;
  field_Integer64   @Validator;
  field_Decimal     @Validator;
  field_Double      @Validator;
  field_Date        @Validator;
  field_Time        @Validator;
  field_DateTime    @Validator;
  field_Timestamp   @Validator;
  field_String      @Validator;
  field_Binary      @Validator;
  field_LargeBinary @Validator;
  field_LargeString @Validator;
};

annotate service.ValidateCdsTypes with {
  field_UUID        @Validator: {title: 'just a test'};
  field_Boolean     @Validator: {title: 'just a test'};
  field_UInt8       @Validator: {title: 'just a test'};
  field_Int16       @Validator: {title: 'just a test'};
  field_Int32       @Validator: {title: 'just a test'};
  field_Integer     @Validator: {title: 'just a test'};
  field_Int64       @Validator: {title: 'just a test'};
  field_Integer64   @Validator: {title: 'just a test'};
  field_Decimal     @Validator: {title: 'just a test'};
  field_Double      @Validator: {title: 'just a test'};
  field_Date        @Validator: {title: 'just a test'};
  field_Time        @Validator: {title: 'just a test'};
  field_DateTime    @Validator: {title: 'just a test'};
  field_Timestamp   @Validator: {title: 'just a test'};
  field_String      @Validator: {title: 'just a test'};
  field_Binary      @Validator: {title: 'just a test'};
  field_LargeBinary @Validator: {title: 'just a test'};
  field_LargeString @Validator: {title: 'just a test'};
};

annotate service.ValidateTypes with {

};

annotate service.ValidateMediaType with {
  image @Validator: {
    type            : 'string',
    contentEncoding : 'base64',
    contentMediaType: 'image/png'
  };
  pdf   @Validator: {
    type            : 'string',
    contentEncoding : 'base64',
    contentMediaType: 'application/pdf'
  };
};


annotate service.ValidateFormats with {
  field_date                @Validator: {format: 'date'};
  field_time                @Validator: {format: 'time'};
  field_datetime            @Validator: {format: 'date-time'};
  // field_isotime             @Validator: {format: 'iso-time'};
  // field_isodatetime         @Validator: {format: 'iso-date-time'};
  field_duration            @Validator: {format: 'duration'};
  field_uri                 @Validator: {format: 'uri'};
  field_urireference        @Validator: {format: 'uri-reference'};
  field_uritemplate         @Validator: {format: 'uri-template'};
  field_url                 @Validator: {format: 'url'};
  field_email               @Validator: {format: 'email'};
  field_hostname            @Validator: {format: 'hostname'};
  field_ipv4                @Validator: {format: 'ipv4'};
  field_ipv6                @Validator: {format: 'ipv6'};
  field_regex               @Validator: {format: 'regex'};
  field_uuid                @Validator: {format: 'uuid'};
  field_jsonpointer         @Validator: {format: 'json-pointer'};
  field_relativejsonpointer @Validator: {format: 'relative-json-pointer'};
  field_byte                @Validator: {format: 'byte'};
  field_int32               @Validator: {format: 'int32'};
  field_int64               @Validator: {format: 'int64'};
  field_float               @Validator: {format: 'float'};
  field_double              @Validator: {format: 'double'};
  field_password            @Validator: {format: 'password'};
  field_binary              @Validator: {format: 'binary'};
};
