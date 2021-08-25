class ParameterProcessor {

  async processParameter(requestData) {
    requestData = this.removeUndefinedParameters(requestData);
    requestData = this.trimRequestParameterValues(requestData);
    return requestData;
  }

  //checks if all the parameters given in request has been specified in init script. if not removes them from requestData object
  removeUndefinedParameters(requestData) {
    console.log("requestData", requestData);
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
    responseObj.value = requestData;
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