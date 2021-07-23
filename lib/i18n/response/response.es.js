const RESPONSE = {
  SUCCESS: { responseCode: 100001, responseMessage: "Éxito" },
  PARAMETER_IS_MANDATORY: { responseCode: 100002, responseMessage: "paramName es un parámetro obligatorio" },
  METHOD_NOT_FOUND: { responseCode: 100003, responseMessage: "API no válida API no encontrada" },
  INVALID_REQUEST_METHOD: { responseCode: 100004, responseMessage: "Método de solicitud no válido" },
  RESPONSE_CODE_NOT_FOUND: { responseCode: 100005, responseMessage: "No se encontró el código de respuesta" },
  INVALID_INPUT_INTEGER: { responseCode: 100006, responseMessage: "paramName debe ser un entero" },
  INVALID_INPUT_EMPTY: { responseCode: 100007, responseMessage: "paramName no debe estar vacío" },
  INVALID_ACCESS_TOKEN: { responseCode: 100008, responseMessage: "Token de acceso no válido" },
  UNKNOWN_ERROR: { responseCode: 100009, responseMessage: "Algo salió mal" }
};

module.exports.RESPONSE = RESPONSE;
