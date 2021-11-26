const requireDir = require("require-dir");
const queryString = require("query-string");
const path = require("path");
const httpRequest = require(path.join(process.cwd(), "src/config/route.json"));
const baseMethodsPath = path.join(process.cwd(), "src/methods/");
class baseHelper {
  static getMethodName(pathParameters) {
    return pathParameters ? pathParameters.proxy : pathParameters;
  }

  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static getMethodPath(methodName) {
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

  static isValidRequestMethod(httpMethod, requestMethod) {
    if (
      typeof requestMethod == "string" &&
      httpMethod.toUpperCase() !== requestMethod.toUpperCase()
    ) {
      return false;
    }
    if (
      typeof requestMethod == "object" &&
      !requestMethod.includes(httpMethod)
    ) {
      return false;
    }
    return true;
  }

  static getCustomRoute(methodName) {
    let pathParameters;
    const requestMap = httpRequest.filter((request) => {
      const pathVal = request.path.replace(/\/:[a-z]+\w+/g, "");
      const pathParamVal = methodName
        .split(pathVal)
        .filter((el) => el.length != 0).length
        ? methodName
            .split(pathVal)
            .filter((el) => el.length != 0)[0]
            .split("/")
            .filter((el) => el.length != 0)
        : [];
      const pathParamKeys = request.path.match(/\/:[a-z]+\w+/g)
        ? request.path
            .match(/\/:[a-z]+\w+/g)
            .map((paramKey) => paramKey.replace("/:", ""))
        : [];
      if (pathParamKeys.length == 0 && pathVal == methodName) {
        return true;
      } else if (
        methodName.search(pathVal) == 0 &&
        pathParamKeys.length == pathParamVal.length
      ) {
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

  static isFileExpected(params) {
    let fileExpected = false;
    Object.keys(params).map((key) => {
      if (params[key].type == "file") fileExpected = true;
    });
    return fileExpected;
  }

  static getMethodClasses(pathName) {
    try {
      return requireDir(pathName);
    } catch (e) {
      return e.code == "MODULE_NOT_FOUND"
        ? { error: e.toString().split("\n")[0] }
        : { error: e.message };
    }
  }

  static parseRequestData(request) {
    let requestData = request.queryStringParameters || {};

    if (typeof request.body == "string") {
      requestData = queryString.parse(request.body);
    } else {
      Object.assign(requestData, request.body ? request.body : {});
    }

    if (request.pathParameters) {
      Object.keys(request.pathParameters).map((key) => {
        requestData
          ? (requestData[key] = request.pathParameters[key])
          : (requestData = { [key]: request.pathParameters[key] });
      });
    }

    return requestData ? requestData : {};
  }
}

module.exports = baseHelper;
