const querystring = require('querystring');
const { decrypt } = require("./encryption");
const { ENCRYPTION_MODE } = JSON.parse(process.env.ENCRYPTION);
const multipart = require('aws-multipart-parser');
const ENC_MODE = require('../lib/constants')

class ParameterProcessor extends baseAction {

  async processParameter(initializer, request, encState) {
    let requestData;
    let encryptionState = true;
    const params = initializer.getParameter();

    let fileExists = false;
    Object.keys(params).map(key => {
      if (params[key].type == 'file') fileExists = true;
    });

    //remove the request query/body parameters from request object
    if (request.httpMethod == 'GET') {
      requestData = request.queryStringParameters;
      encryptionState = encState == 1;
      if (!fileExists && (ENCRYPTION_MODE == ENC_MODE.STRICT || (ENCRYPTION_MODE == ENC_MODE.OPTIONAL && encryptionState))) {
        requestData = requestData.data ? JSON.parse(decrypt(requestData.data)) : {};
      }
      request.queryStringParameters = null;
      request.multiValueQueryStringParameters = null;
    } else if (request.httpMethod == 'POST') {
      if (typeof (request.body) == "string") {
        if (fileExists) {
          requestData = multipart.parse(request, true);
        } else {
          requestData = querystring.parse(request.body);
        }
        encryptionState = encState == 1;
        if (!fileExists && (ENCRYPTION_MODE == ENC_MODE.STRICT || (ENCRYPTION_MODE == ENC_MODE.OPTIONAL && encryptionState))) {
          const urlParams = new URLSearchParams(requestData);
          requestData = requestData.data ? JSON.parse(decrypt(Object.fromEntries(urlParams).data)) : {};
        }
      } else {
        requestData = request.body;
        encryptionState = encState == 1;
        if (!fileExists && (ENCRYPTION_MODE == ENC_MODE.STRICT || (ENCRYPTION_MODE == ENC_MODE.OPTIONAL && encryptionState))) {
          requestData = requestData.data ? JSON.parse(decrypt(requestData.data)) : {};
        }
      }
      request.body = null;
    }

    if (request.pathParameters) {
      Object.keys(request.pathParameters).map(key => {
        requestData ? requestData[key] = request.pathParameters[key] : requestData = { [key]: request.pathParameters[key] };
      });
    }

    requestData = requestData ? requestData : {};

    this.removeUndefinedParameters(params, {}, requestData);

    this.trimRequestParameterValues(requestData);

    return requestData;
  }

  //checks if all the parameters given in request has been specified in init script. if not removes them from requestData object
  removeUndefinedParameters(paramData, authParamData, requestData) {

    let matchFound = false;
    for (let requestParamName in requestData) {
      matchFound = false;
      for (let paramName in paramData) {
        if (requestParamName == paramData[`${paramName}`].name) {
          matchFound = true;
        }
      }
      for (let paramName in authParamData) {
        if (requestParamName == authParamData[`${paramName}`].name) {
          matchFound = true;
        }
      }
      if (!matchFound) {
        delete requestData[`${requestParamName}`];
      }
    }
  }


  //trims the spaces if any in the request parameter's value
  trimRequestParameterValues(requestData) {
    for (let paramName in requestData) {
      if (typeof (requestData[`${paramName}`]) == "string") {
        requestData[`${paramName}`] = requestData[`${paramName}`].trim();
      }
    }
  }

  validateParameters(param, requestData) {
    let responseObj = { error: null, data: {} };
    let isSuccessfull = this.verifyRequiredParameter(param, requestData);
    if (!isSuccessfull) {
      responseObj.error = { errorCode: "INVALID_INPUT_EMPTY", parameterName: param.name };
      return responseObj;
    }

    if (!this.convertToGivenParameterType(param, requestData)) {
      responseObj.error = { errorCode: "INVALID_INPUT_EMPTY", parameterName: param.name };
      return responseObj;
    }
    this.setDefaultParameters(param, requestData);
    responseObj.data = requestData;
    return responseObj;
  }

  //converts all the request parameters to the specified type(number and string)
  convertToGivenParameterType(paramData, requestData) {
    if (requestData && requestData != "") {
      if (paramData.type == "number") {
        requestData = Number(requestData);
        if (isNaN(requestData)) {
          //set error response if a parameter is specified in request but is not an integer
          return false;
        }
      } else if (paramData.type == "string") {
        requestData = requestData.toString();
      }
    } else if (requestData == "") {
      //set error response if a parameter is specified in request but is empty
      return false;
    }
    return true;
  }

  //if the given parameter has a default value specified and request does not have that parameter
  //then set that default value for that parameter in the request
  setDefaultParameters(paramData, requestData) {
    if (!requestData) {
      if (paramData.type == "number" && paramData.default !== "") {
        requestData = Number(paramData.default);
      } else if (paramData.type == "string" && paramData.default !== "") {
        requestData = paramData.default.toString();
      }
    }
  }

  //checks if the parameter is set as required and the that parameter has some value in the request
  verifyRequiredParameter(paramData, requestData) {
    //checks if the paramater is given in request by user
    if (paramData.required && ((typeof (requestData) == "string" && requestData.trim() == "") || (typeof (requestData) == "number" && isNaN(requestData)))) {
      return false;
    }

    return true;
  }
}

module.exports = ParameterProcessor;