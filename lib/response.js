const RESPONSE = {
  SUCCESS: { responseCode: 100001, responseMessage: "Success" },
  PARAMETER_IS_MANDATORY: { responseCode: 100002, responseMessage: "paramName is Mandatory Parameter" },
  METHOD_NOT_FOUND: { responseCode: 100003, responseMessage: "Invalid API! API not found" },
  INVALID_REQUEST_METHOD: { responseCode: 100004, responseMessage: "Invalid Request method" },
  RESPONSE_CODE_NOT_FOUND: { responseCode: 100005, responseMessage: "Response code not found" },
  INVALID_INPUT_INTEGER: { responseCode: 100006, responseMessage: "paramName should be a integer" },
  INVALID_INPUT_EMPTY: { responseCode: 100007, responseMessage: "paramName should not be empty" },
  INVALID_ACCESS_TOKEN: { responseCode: 100008, responseMessage: "Invalid access token" },
  UNKNOWN_ERROR: { responseCode: 100009, responseMessage: "Something went wrong" }
};

module.exports.RESPONSE = RESPONSE;
