const RESPONSE = {
  SUCCESS: {
    responseCode: 100001, responseMessage: {
      "en": "Success",
      "es": "Éxito",
    }
  },
  PARAMETER_IS_MANDATORY: {
    responseCode: 100002, responseMessage: {
      "en": "paramName is Mandatory Parameter",
      "es": "paramName es un parámetro obligatorio",
    },
  },
  METHOD_NOT_FOUND: {
    responseCode: 100003, responseMessage: {
      "en": "Invalid API! API not found",
      "es": "API inválida! API no encontrada"
    },
  },
  INVALID_REQUEST_METHOD: {
    responseCode: 100004, responseMessage: {
      "en": "Invalid Request method",
      "es": "Método de solicitud inválido"
    },
  },
  RESPONSE_CODE_NOT_FOUND: {
    responseCode: 100005, responseMessage: {
      "en": "Response code not found",
      "es": "Código de respuesta no encontrado"
    },
  },
  INVALID_INPUT_INTEGER: {
    responseCode: 100006, responseMessage: {
      "en": "paramName should be a integer",
      "es": "paramName debe ser un entero"
    }
  },
  INVALID_INPUT_EMPTY: {
    responseCode: 100007, responseMessage: {
      "en": "paramName should not be empty",
      "es": "paramName no debe estar vacío"
    }
  },
  INVALID_ACCESS_TOKEN: {
    responseCode: 100008, responseMessage: {
      "en": "Invalid access token",
      "es": "Token de acceso inválido"
    }
  },
  ENCRYPTION_STATE_STRICTLY_ENABLED: {
    responseCode: 100009, responseMessage: {
      "en": "Encryption state is strictly enabled",
      "es": "El estado de encriptación está estrictamente habilitado"
    }
  },
  METHOD_NOT_LOADED:{
    responseCode: 100010, responseMessage: {
      "en": "Error while loading the method !!",
      "es": "Error al cargar el método !!"
    }
  },
  UNKNOWN_ERROR: {
    responseCode: 100011, responseMessage: {
      "en": "Something went wrong",
      "es": "Algo salió mal"
    }
  }
};

module.exports.RESPONSE = RESPONSE;
