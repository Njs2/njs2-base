/* eslint-disable-next-line no-unused-vars */
module.exports.execute = async event => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(require('./postman.json')),
  };
}