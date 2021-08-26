class ParameterProcessor {

  async processParameter(requestData) {
    requestData = this.removeUndefinedParameters(requestData);
    requestData = this.trimRequestParameterValues(requestData);
    return requestData;
  }

  //checks if all the parameters given in request has been specified in init script. if not removes them from requestData object
  removeUndefinedParameters(requestData) {
    if (!["number", "string"].includes(typeof requestData) || (typeof requestData == "object" && !requestData)) {
      return;
    }
    return requestData;
  }

  //trims the spaces if any in the request parameter's value
  trimRequestParameterValues(requestData) {
    if (typeof requestData === "string") {
      return requestData.trim();
    }
    return requestData;
  }

  validateParameters(param, requestData) {
    let responseObj = { error: null, value: null };
    // Check Type of param
    let paramData = this.convertToGivenParameterType(param, requestData);
    if (!paramData) {
      responseObj.error = { errorCode: "INVALID_INPUT_EMPTY", parameterName: param.name };
      return responseObj;
    }

    //Check if param is declared as Mandatory or Optional in InitClass
    let validatedData = this.verifyRequiredParameter(param, paramData);
    if (!validatedData) {
      responseObj.error = { errorCode: "INVALID_INPUT_EMPTY", parameterName: param.name };
      return responseObj;
    }

    //Set Default value to param when it is Optional
    responseObj.value = this.setDefaultParameters(param, validatedData);
    return responseObj;
  }

  //converts all the request parameters to the specified type(number and string)
  convertToGivenParameterType(paramData, requestData) {
    let res;
    switch (paramData.type) {
      case "number":
        res = Number(requestData);
        // set error response if a parameter is specified in request but is not an integer
        if (isNaN(res)) {
          return false;
        }
        break;

      case "string":
        res = requestData.toString();
        break;

      case "file":
        res = requestData;
        break;

      default:
        res = requestData;
        break;
    }
    return res;
  }

  //if the given parameter has a default value specified and request does not have that parameter
  //then set that default value for that parameter in the request
  setDefaultParameters(paramData, requestData) {
    let res = requestData;
    if (!requestData) {
      if (paramData.type == "number" && paramData.default !== "") {
        res = Number(paramData.default);
      } else if (paramData.type == "string" && paramData.default !== "") {
        res = paramData.default.toString();
      }
    }
    return res;
  }

  //checks if the parameter is set as required and the that parameter has some value in the request
  verifyRequiredParameter(paramData, requestData) {
    //checks if the paramater is given in request by user
    if (paramData.required && ((typeof (requestData) == "string" && requestData.trim() == "") || (typeof (requestData) == "number" && isNaN(requestData)))) {
      return false;
    }

    return requestData;
  }
}

module.exports = ParameterProcessor;