const path = require("path");
baseInitialize = require('./baseInitialize.class');
baseAction = require("./baseAction.class");
basePkg = require("./basePackage.class");
glbvalue = require(path.join(process.cwd(), "src/global/index.js"));

require("./env");

const requireDir = require('require-dir');
const Autoload = require('./autoload.class');
const { encrypt } = require("./encryption");
const ParameterProcessor = require('./parameterProcessor.class');
const httpRequest = require(path.join(process.cwd(), "src/config/route.json"));
const { ENCRYPTION_MODE } = JSON.parse(process.env.ENCRYPTION);

const baseMethodsPath = path.join(process.cwd(), "src/methods/");
class executor extends baseAction {

  constructor() {
    super();
    this.responseData = {};
  }

  async executeMethod(event) {
    try {
      let { lng_key: lngKey } = event.headers;
      if (lngKey) this.setMemberVariable('lng_key', lngKey);

      // If no error mssseage is overwritten, then returns default error
      this.setResponse('UNKNOWN_ERROR');
      let methodName = event.pathParameters;
      methodName = methodName ? methodName.proxy : methodName;
      console.log("API invoked--> ", methodName);

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
      })

      let pathName = baseMethodsPath + splitString.join("");
      console.log("Looking for folder --> ", pathName);

      event.pathParameters = null;
      if (!this.methodExists(pathName)) {
        const requestMap = httpRequest.filter(request => {
          const pathVal = request.path.replace(/\/:[a-z]+\w+/g, "");
          const pathParamVal = methodName.split(pathVal).filter((el) => el.length != 0).length
            ? methodName.split(pathVal).filter((el) => el.length != 0)[0].split('/').filter((el) => el.length != 0)
            : [];
          const pathParamKeys = request.path.match(/\/:[a-z]+\w+/g) ? request.path.match(/\/:[a-z]+\w+/g).map(paramKey => paramKey.replace('/:', '')) : [];
          if (pathParamKeys.length == 0 && pathVal == methodName) {
            return true;
          } else if (methodName.search(pathVal) == 0 && pathParamKeys.length == pathParamVal.length) {
            event.pathParameters = {};
            pathParamKeys.map((key, index) => {
              event.pathParameters[key] = pathParamVal[index];
            });
            return true;
          }
          return false;
        });

        if (requestMap.length != 0) {
          pathName = baseMethodsPath + requestMap[0].methodName;
        }
      }

      const {
        action,
        init
      } = requireDir(pathName);

      const initializer = new init();
      const executeAction = new action();

      if (!this.methodExists(pathName)) {
        this.setResponse('METHOD_NOT_FOUND');
        return false;
      }

      if (!await this.executeInitializer(event, initializer, executeAction)) {
        this.responseData = {};
        return false;
      }


      if (!(await this.executeAction(executeAction))) {
        this.responseData = {};
        return false;
      }

      return true;
    } catch (e) {
      if (process.env.MODE == "DEV") this.setDebugMessage(e.message);
      console.log("Exception caught", e);
      return false;
    }
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  async executeInitializer(event, initializer, action) {

    if (!this.isValidRequestMethod(event.httpMethod, initializer.pkgInitializer.requestMethod)) {
      return false;
    }

    const parameterProcessor = new ParameterProcessor();
    if (!await parameterProcessor.processParameter(initializer, event, action)) {
      return false;
    }

    return true;
  }

  async executeAction(action) {
    this.responseData = await action.executeMethod(Autoload.requestData);
    if (ENCRYPTION_MODE == "strict" || (ENCRYPTION_MODE == "optional" && Autoload.encryptionState)) {
      this.responseData = encrypt(JSON.stringify(this.responseData));
    }
    return true;
  }

  getResponse() {
    const response = {
      responseCode: Autoload.responseCode,
      responseMessage: Autoload.responseMessage,
      responseData: this.responseData,
    }
    return response;
  }

  isValidRequestMethod(httpMethod, requestMethod) {
    if (httpMethod.toUpperCase() !== requestMethod.toUpperCase()) {
      this.setResponse('INVALID_REQUEST_METHOD');
      return false;
    }
    return true;
  }

  methodExists(pathName) {
    try {
      requireDir(pathName);
      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports = executor;
