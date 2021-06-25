module.exports.loadResponse = (RESPONSE, packageName) => {
  if (RESPONSE) {
    const RESP = {};
    Object.keys(RESPONSE).map(res => {
      RESP[packageName ? `${packageName}-${res}` : res] = RESPONSE[res];
    });

    if (global.RESPONSE) {
      global.RESPONSE = { ...RESP, ...global.RESPONSE };
    } else {
      global.RESPONSE = { ...RESP };
    }
  }
};