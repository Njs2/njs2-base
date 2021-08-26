require('bytenode')
const responseHelper = require('@njs2/base/base/response.lib');
const Executor = require("@njs2/base/base/executor.class");

module.exports.execute = async event => {

  try {
    const executor = new Executor();
    await executor.executeRequest(event);

    return responseHelper.send(executor.getResponse());
  } catch (e) {
    console.log(e);
  }
}