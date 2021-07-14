const querystring = require('querystring');
const Autoload = require('./autoload.class');
const dbManager = require("../package/dbManager").dbManager;
const { decrypt } = require("./encryption");
const { ENCRYPTION_MODE } = JSON.parse(process.env.ENCRYPTION);
const multipart = require('aws-multipart-parser');

class ParameterProcessor extends baseAction {

  async processParameter(initializer, event, action) {
    let requestData;
    let encryptionState = true;
    const params = initializer.getParameter();
    const isSecured = initializer.pkgInitializer.isSecured;

    let fileExists = false;
    Object.keys(params).map(key => {
      if (params[key].type == 'file') fileExists = true;
    });

    try {
      console.log(event.body)
      //remove the request query/body parameters from request object
      if (event.httpMethod == 'GET') {
        requestData = event.queryStringParameters;
        encryptionState = requestData.enc_state == 1;
        if (!fileExists && (ENCRYPTION_MODE == "strict" || (ENCRYPTION_MODE == "optional" && encryptionState))) {
          requestData = requestData.data ? JSON.parse(decrypt(requestData.data)) : {};
        }
        event.queryStringParameters = null;
        event.multiValueQueryStringParameters = null;
      } else if (event.httpMethod == 'POST') {
        if (typeof (event.body) == "string") {
          if (fileExists) {
            requestData = multipart.parse(event, true);
          } else {
            requestData = querystring.parse(event.body);
          }
          encryptionState = requestData.enc_state == 1;
          if (!fileExists && (ENCRYPTION_MODE == "strict" || (ENCRYPTION_MODE == "optional" && encryptionState))) {
            const urlParams = new URLSearchParams(requestData);
            requestData = requestData.data ? JSON.parse(decrypt(Object.fromEntries(urlParams).data)) : {};
          }
        } else {
          requestData = event.body;
          encryptionState = requestData.enc_state == 1;
          if (!fileExists && (ENCRYPTION_MODE == "strict" || (ENCRYPTION_MODE == "optional" && encryptionState))) {
            requestData = requestData.data ? JSON.parse(decrypt(requestData.data)) : {};
          }
        }
        event.body = null;
      }

      if (event.pathParameters) {
        Object.keys(event.pathParameters).map(key => {
          requestData ? requestData[key] = event.pathParameters[key] : requestData = { [key]: event.pathParameters[key] };
        });
      }

      requestData = requestData ? requestData : {};
      Autoload.requestData = requestData;
      Autoload.encryptionState = encryptionState;

      this.removeUndefinedParameters(params, {}, requestData);

      this.trimRequestParameterValues(requestData);

      //process the user_id and access_token parameters here
      if (isSecured) {
        let { access_token: accessToken } = event.headers;

        if (!accessToken || typeof accessToken != "string" || accessToken.trim() == "") {
          let options = [];
          options.paramName = 'access_token';
          this.setResponse("INVALID_INPUT_EMPTY", options);
          return false;
        }

        if ((ENCRYPTION_MODE == "strict" || (ENCRYPTION_MODE == "optional" && encryptionState))) {
          accessToken = decrypt(accessToken);
        }

        const validatedUser = await dbManager.verifyAccessToken(accessToken);
        if (!validatedUser) {
          this.setResponse("INVALID_ACCESS_TOKEN");
          return false;
        }

        action.setMemberVariable('accessToken', accessToken);
        action.setMemberVariable('userObj', validatedUser);
      }

      if (!this.validateParameters(params, requestData, action)) {
        return false;
      }
      return true;
    } catch (e) {
      console.log(e)
    }
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

  //get the auth parameters(userId and accessToken)
  getAuthParameters() {
    const param = [];

    param.accessToken = {
      name: "access_token",
      type: "string",
      description: "access token",
      required: true,
      default: ""
    }
    return param;
  }

  validateParameters(param, requestData, action) {
    let errorParameterName, result = true;
    for (let paramName in param) {
      let isSuccessfull = this.verifyRequiredParameter(paramName, param, requestData);
      if (!isSuccessfull) {
        //the required parameter is not passed or has an empty value in the request
        result = false;
        errorParameterName = param[`${paramName}`].name;
        break;
      }

      if (!this.convertToGivenParameterType(paramName, param, requestData)) {
        return false;
      }
      this.setDefaultParameters(paramName, param, requestData);
      this.setVariableValues(paramName, param, requestData, action);
    }

    if (errorParameterName) {
      let options = [];
      options.paramName = errorParameterName;
      this.setResponse("PARAMETER_IS_MANDATORY", options);
      return false;
    }
    return true;
  }

  setVariableValues(paramName, paramData, requestData, action) {
    const requestParamName = paramData[`${paramName}`].name;
    action.setMemberVariable(paramName, requestData[`${requestParamName}`]);
  }
  //converts all the request parameters to the specified type(number and string)
  convertToGivenParameterType(paramName, paramData, requestData) {
    const requestParamName = paramData[`${paramName}`].name;

    if (requestData[`${requestParamName}`] && requestData[`${requestParamName}`] != "") {
      if (paramData[`${paramName}`].type == "number") {

        requestData[`${requestParamName}`] = Number(requestData[`${requestParamName}`]);

        if (isNaN(requestData[`${requestParamName}`])) {
          //set error response if a parameter is specified in request but is not an integer
          let options = [];
          options.paramName = requestParamName;
          this.setResponse("INVALID_INPUT_INTEGER", options);
          return false;
        }

      } else if (paramData[`${paramName}`].type == "string") {
        requestData[`${requestParamName}`] = requestData[`${requestParamName}`].toString();
      }
    } else if (requestData[`${requestParamName}`] == "") {
      //set error response if a parameter is specified in request but is empty
      let options = [];
      options.paramName = requestParamName;
      this.setResponse("INVALID_INPUT_EMPTY", options);
      return false;
    }
    return true;
  }

  //if the given parameter has a default value specified and request does not have that parameter
  //then set that default value for that parameter in the request
  setDefaultParameters(paramName, paramData, requestData) {
    const requestParamName = paramData[`${paramName}`].name;

    if (!requestData[`${requestParamName}`]) {
      if (paramData[`${paramName}`].type == "number" && paramData[`${paramName}`].default !== "") {

        requestData[`${requestParamName}`] = Number(paramData[`${paramName}`].default);

      } else if (paramData[`${paramName}`].type == "string" && paramData[`${paramName}`].default !== "") {

        requestData[`${requestParamName}`] = paramData[`${paramName}`].default.toString();
      }
    }
  }

  //checks if the parameter is set as required and the that parameter has some value in the request
  verifyRequiredParameter(paramName, paramData, requestData) {
    const requestParamName = paramData[`${paramName}`].name;

    //if requestdata is empty and no params or body passed
    if (!requestData) {
      return false;
    }
    //checks if the paramater is given in request by user
    if (paramData[`${paramName}`].required && (!requestData[`${requestParamName}`] ||
      typeof (requestData[`${paramName}`]) == "string" && requestData[`${requestParamName}`].trim() == "")) {
      return false;
    }

    return true;
  }
}

module.exports = ParameterProcessor;