const path = require("path");

// TODO: revisit global imports
baseInitialize = require('./baseInitialize.class');
baseAction = require("./baseAction.class");
basePkg = require("./basePackage.class");
baseHelper = require("../helper/baseHelper.class");
// TODO: move to global helper Static CLass which can be used everywhere
glbvalue = require(path.join(process.cwd(), "src/global/index.js"));

const requireDir = require('require-dir');
const ParameterProcessor = require('./parameterProcessor.class');
const dbManager = require("../helper/dbManager").dbManager;
const httpRequest = require(path.join(process.cwd(), "src/config/route.json"));
const { encrypt, decrypt } = require('./encryption');
const { ENC_MODE, DEFAULT_LNG_KEY, ENC_ENABLED } = require('../helper/globalConstants');
const jwt = require('../helper/jwt');


const baseMethodsPath = path.join(process.cwd(), "src/methods/");
class executor {
  constructor() {
    this.responseData = {};
  }

  async executeRequest(request) {

    try {
      this.setResponse('UNKNOWN_ERROR');

      // Initializng basic variables
      const { lng_key: lngKey, access_token: accessToken, enc_state: encState } = request.headers;
      const { ENCRYPTION_MODE } = JSON.parse(process.env.ENCRYPTION);
      // Enforce enc_state to be true if encryption is Strict
      if (ENCRYPTION_MODE == ENC_MODE.STRICT && encState != ENC_ENABLED) {
        this.setResponse('ENCRYPTION_STATE_STRICTLY_ENABLED');
        throw new Error();
      }
      const encryptionState = (ENCRYPTION_MODE == ENC_MODE.STRICT || (ENCRYPTION_MODE == ENC_MODE.OPTIONAL && encState == ENC_ENABLED));
      if (lngKey) this.setMemberVariable('lng_key', lngKey);
      this.setMemberVariable('encryptionState', encryptionState);

      // Finalize methodName including custom route
      let methodName = this.getMethodName(request.pathParameters);

      request.pathParameters = null;
      const { customMethodName, pathParameters } = this.getCustomRoute(methodName);
      if (customMethodName) {
        request.pathParameters = pathParameters;
        methodName = customMethodName;
      }

      // Resolve path from methodName
      const pathName = this.getMethodPath(methodName);
      const methodClasses = this.getMethodClasses(pathName);
      if (!methodClasses) {
        this.setResponse('METHOD_NOT_FOUND');
        throw new Error();
      }

      // Include required files and initiate instances
      const { action: ActionClass, init: InitClass } = methodClasses;
      const initInstance = new InitClass();
      const actionInstance = new ActionClass();
      if (lngKey) {
        actionInstance.setMemberVariable('lng_key', lngKey);
      }

      // Validate request method with initializer
      if (!this.isValidRequestMethod(request.httpMethod, initInstance.pkgInitializer.requestMethod)) {
        this.setResponse('INVALID_REQUEST_METHOD');
        throw new Error();
      }

      // if secured endpoint validate access token
      if (initInstance.pkgInitializer.isSecured) {
        const { error, data } = await this.validateAccesstoken(accessToken);
        if (error) {
          this.setResponse(error.errorCode, {
            paramName: error.parameterName
          });
          throw new Error();
        }
        actionInstance.setMemberVariable('userObj', data);
      }
      // validate & process request parameters
      const parameterProcessor = new ParameterProcessor();
      const params = initInstance.getParameter();
      const isFileExpected = this.isFileExpected(params);
      let requestData = this.parseRequestData(request, isFileExpected);
      // If encyption is enabled, then decrypt the request data
      if (!isFileExpected && encryptionState) {
        requestData = decrypt(requestData.data);
        if (typeof requestData === 'string')
          requestData = JSON.parse(requestData);
      }

      requestData = requestData ? requestData : {};
      for (let paramName in params) {
        let param = params[paramName];
        const parsedData = await parameterProcessor.processParameter(requestData[param.name]);
        const { error, value } = parameterProcessor.validateParameters(param, parsedData);
        if (error) {
          this.setResponse(error.errorCode, {
            paramName: error.parameterName
          });
          throw new Error();
        }
        actionInstance.setMemberVariable(paramName, value);
      }

      // Initiate and Execute method
      this.responseData = await actionInstance.executeMethod();
      const { responseString, responseOptions, packageName } = actionInstance.getResponseString();
      // OR: this.setResponse(responseString, responseOptions);
      const { responseCode, responseMessage } = this.getResponse(responseString, responseOptions, packageName);
      if (encryptionState) {
        this.responseData = encrypt(JSON.stringify(this.responseData));
      }

      return {
        responseCode,
        responseMessage,
        responseData: this.responseData
      };
    } catch (e) {
      console.log("Exception caught", e);
      const { responseCode, responseMessage } = this.getResponse();
      if (process.env.MODE == "DEV" && e.message) this.setDebugMessage(e.message);
      return {
        responseCode,
        responseMessage,
        responseData: {}
      };
    }
  }

  /** HELPER METHODS */

  getMethodName(pathParameters) {
    return pathParameters ? pathParameters.proxy : pathParameters;
  }

  getMethodPath(methodName) {
    let splitString = methodName.split("/");
    splitString = splitString.map((element, index) => {
      //Checking for index > 1 because if method name is "/user/detail" then second resource(detail) should
      //get converted to Pascal case "user" should be camel case
      if (index == 1) {
        element = `.${element}`;
      } else if (index > 1) {
        element = this.capitalizeFirstLetter(element);
      }
      return element;
    });

    return baseMethodsPath + splitString.join("");
  }

  getCustomRoute(methodName) {
    let pathParameters;
    const requestMap = httpRequest.filter(request => {
      const pathVal = request.path.replace(/\/:[a-z]+\w+/g, "");
      const pathParamVal = methodName.split(pathVal).filter((el) => el.length != 0).length
        ? methodName.split(pathVal).filter((el) => el.length != 0)[0].split('/').filter((el) => el.length != 0)
        : [];
      const pathParamKeys = request.path.match(/\/:[a-z]+\w+/g) ? request.path.match(/\/:[a-z]+\w+/g).map(paramKey => paramKey.replace('/:', '')) : [];
      if (pathParamKeys.length == 0 && pathVal == methodName) {
        return true;
      } else if (methodName.search(pathVal) == 0 && pathParamKeys.length == pathParamVal.length) {
        pathParameters = {};
        pathParamKeys.map((key, index) => {
          pathParameters[key] = pathParamVal[index];
        });
        return true;
      }
      return false;
    });

    if (requestMap.length != 0) {
      return { customMethodName: requestMap[0].methodName, pathParameters };
    }
    return {};
  }

  // TODO: In future we will move this to an Authorization class
  validateAccesstoken = async (accessToken) => {
    let validationResponse = { error: null, data: {} };
    if (!accessToken || typeof accessToken != "string" || accessToken.trim() == "") {
      validationResponse.error = { errorCode: "INVALID_INPUT_EMPTY", parameterName: 'access_token' };
      return validationResponse;
    }

    const { AUTH_MODE, JWT_SECRET, JWT_ID_KEY, DB_ID_KEY, DB_TABLE_NAME, DB_ACCESS_KEY } = JSON.parse(process.env.AUTH);
    const decodedVal = await jwt.decodeJwtToken(accessToken, JWT_SECRET);

    if (!decodedVal || !decodedVal[JWT_ID_KEY]) {
      validationResponse.error = { errorCode: "INVALID_INPUT_EMPTY", parameterName: 'access_token' };
      return validationResponse;
    }

    if (AUTH_MODE == "JWT_DB") {
      const verifedUser = await dbManager.find(DB_TABLE_NAME, { [DB_ACCESS_KEY]: accessToken, [DB_ID_KEY]: decodedVal[JWT_ID_KEY] });
      if (verifedUser.length > 0) {
        validationResponse.data = verifedUser[0];
        return validationResponse;
      };
    } else {
      validationResponse.data = { [DB_ID_KEY]: decodedVal[JWT_ID_KEY] };
      return validationResponse;
    }

  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  isValidRequestMethod(httpMethod, requestMethod) {
    if (typeof requestMethod == "string" && httpMethod.toUpperCase() !== requestMethod.toUpperCase()) {
      return false;
    }
    if (typeof requestMethod == "object" && !requestMethod.includes(httpMethod)) {
      return false;
    }
    return true;
  }

  getMethodClasses(pathName) {
    try {
      return requireDir(pathName);
    } catch (e) {
      return false;
    }
  }

  isFileExpected(params) {
    let fileExpected = false;
    Object.keys(params).map(key => {
      if (params[key].type == 'file') fileExpected = true;
    });
    return fileExpected;
  }

  parseRequestData(request) {
    let requestData = request.queryStringParameters || {};

    Object.assign(requestData, request.body ? request.body : {});

    if (request.pathParameters) {
      Object.keys(request.pathParameters).map(key => {
        requestData
          ? (requestData[key] = request.pathParameters[key])
          : (requestData = { [key]: request.pathParameters[key] });
      });
    }

    return requestData ? requestData : {};
  }

  setMemberVariable(paramName, value) {
    this[`${paramName}`] = value;
    return true;
  }

  setDebugMessage(msg) {
    this.responseMessage = msg;
  }

  setResponse(responseString, options) {
    this.responseString = responseString;
    this.responseOptions = options;
    return true;
  }

  getResponse(responseString, responseOptions, packageName) {
    if (responseString) {
      this.responseString = responseString;
      this.responseOptions = responseOptions;
    }
    const BASE_RESPONSE = require(path.resolve(process.cwd(), `src/global/i18n/response.js`)).RESPONSE;
    const PROJECT_RESPONSE = require(`../i18n/response.js`).RESPONSE;

    let RESP = { ...PROJECT_RESPONSE, ...BASE_RESPONSE };

    if (packageName) {
      try {
        const PACKAGE_RESPONSE = require(path.resolve(process.cwd(), `/${packageName}/contract/response.json`));
        RESP = { ...RESP, ...PACKAGE_RESPONSE };
      } catch {
      }
    }

    if (!RESP[this.responseString]) {
      RESP = RESP["RESPONSE_CODE_NOT_FOUND"];
    } else {
      RESP = RESP[this.responseString];
    }

    this.responseCode = RESP.responseCode;
    this.responseMessage = this.lng_key && RESP.responseMessage[this.lng_key]
      ? RESP.responseMessage[this.lng_key]
      : RESP.responseMessage[DEFAULT_LNG_KEY];

    if (this.responseOptions)
      Object.keys(this.responseOptions).map(keyName => {
        this.responseMessage = this.responseMessage.replace(keyName, this.responseOptions[keyName]);
      });

    return {
      responseCode: this.responseCode,
      responseMessage: this.responseMessage,
      responseData: this.responseData
    };
  }
}

module.exports = executor;