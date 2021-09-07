const pjson = require('../../package.json');
const baseHelper = require('@njs2/base/helper/baseHelper.class');

const [
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY_ID,
  AWS_ROLE_ARN
] = baseHelper.loadConfig(["AWS_REGION", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY_ID", "AWS_ROLE_ARN"], pjson.name);


const websocketHelper = {};

// Assume role to make aws sdk calls.
websocketHelper.getCrossAccountCredentials = async () => {
  return new Promise((resolve, reject) => {
    if (!AWS_ROLE_ARN || !AWS_ROLE_ARN.length) {
      resolve({
        region: AWS_REGION,
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY_ID
      });
    } else if (!AWS_ACCESS_KEY_ID || !AWS_ACCESS_KEY_ID.length) {
      resolve({});
    } else {
      const AWS = require('aws-sdk');
      const sts = new AWS.STS({
        region: AWS_REGION,
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY_ID,
      });
      const timestamp = (new Date()).getTime();
      const params = {
        RoleArn: AWS_ROLE_ARN,
        RoleSessionName: `AWS-WEBSOCKET-${timestamp}`
      };

      sts.assumeRole(params, (err, data) => {
        if (err) reject(err);
        else {
          resolve({
            region: AWS_REGION,
            accessKeyId: data.Credentials.AccessKeyId,
            secretAccessKey: data.Credentials.SecretAccessKey,
            sessionToken: data.Credentials.SessionToken,
          });
        }
      });
    }
  });
};

module.exports = websocketHelper;