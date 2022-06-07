class ParameterProcessor {

  processParameter(requestData) {
    requestData = this.removeUndefinedParameters(requestData);
    requestData = this.trimRequestParameterValues(requestData);
    return requestData;
  }

  //checks if all the parameters given in request has been specified in init script. if not removes them from requestData object
  removeUndefinedParameters(requestData) {
    if (!["number", "string","object"].includes(typeof requestData) || (typeof requestData == "object" && !requestData)) {
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
    // Check Type of parameter
    let paramData = this.convertToGivenParameterType(param, requestData);

    //Check if param is declared as Mandatory or Optional in InitClass
    let validatedData = this.verifyRequiredParameter(param, paramData);
    if (validatedData.error) {
      responseObj.error = { errorCode: "INVALID_INPUT_EMPTY", parameterName: param.name };
      return responseObj;
    }

    //Set Default value to param when it is Optional
    responseObj.value = this.setDefaultParameters(param, validatedData.data);
    return responseObj;
  }

  //converts all the request parameters to the specified type(number and string)
  convertToGivenParameterType(paramData, requestData) {
    let res;
    switch (paramData.type) {
      case "number":
        res = Number(requestData);
        // set error response if a parameter is specified in request but is not an integer
        if (isNaN(res)|| requestData === "") {
          return;
        }
        break;

      case "string":
        if (!requestData) return;
        res = requestData.toString();
        break;

      case "file":
        // check if json has keys "type" = "file", "fileName", content and Content-Type
        if (requestData && (requestData.type != "file" || !requestData.filename || !requestData.contentType || !requestData.content)) {
          return;
        }
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
    if (!requestData && paramData.required) {
      if (paramData.type == "number" && paramData.default !== "" && requestData === undefined) {
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
    if (paramData.required && ((paramData.type == "string" && (!requestData || requestData.trim() == "")) || (paramData.type == "number" && isNaN(requestData)) || (paramData.type=="file" && !requestData)) ) {
      return { error: true };
    }

    return { error: false, data: requestData };
  }
}

module.exports = ParameterProcessor;
