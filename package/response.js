const path = require('path');

const getResponseList = async () => {
  let responseList = require('../lib/response').RESPONSE;
  let projectResponse = require(path.resolve(process.cwd(), `src/global/response.js`)).RESPONSE;

  responseList = projectResponse ? { ...responseList, ...projectResponse } : { ...responseList };
  return Object.keys(responseList).map(res => responseList[res]);
}

module.exports.getResponseList = getResponseList;