const AWS = require('aws-sdk');
const pjson = require('../package.json');
const GlobalMethods = require('../helper/globalMethods');
const [ WSS_BASE_URL ] = GlobalMethods.loadConfig(["WSS_BASE_URL"], pjson.name);

const emit = async (connectionId, payload) => {
  try {
    if (!connectionId) return;

    const credentials = {
      region: '', // AWS APIs would need atleast an empty string in region key
      apiVersion: '2018-11-29',
      endpoint: WSS_BASE_URL
    }

    const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi(credentials);
    await apiGatewayManagementApi.postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify(payload),
    }).promise();
  } catch (e) {
    console.log("postToConnection API gateway error:", e);
  }
}

module.exports = {
  emit: emit
}