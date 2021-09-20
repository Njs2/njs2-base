// Import and load env files
AutoLoad = require('@njs2/base/base/autoload.class');
AutoLoad.loadConfig();
AutoLoad.loadModules();

// Import Executor class
const Executor = require("@njs2/base/base/executor.class");

module.exports.execute = async event => {

  try {
    if (event.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      const querystring = require('querystring');
      event.body = querystring.parse(event.body);
    }

    if (event.headers['Content-Type'] && event.headers['Content-Type'].indexOf('multipart/form-data') === 0) {
      const multipart = require('aws-multipart-parser');
      event.body = multipart.parse(event, true);
    }
    const executor = new Executor();
    const response = await executor.executeRequest(event);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(response),
    };
  } catch (e) {
    console.log(e);
  }
}