/* External Package imports */
const express = require('express');
const http = require('http');
const multer = require('multer');

AutoLoad = require('@njs2/base/base/autoload.class');
AutoLoad.loadConfig();
AutoLoad.loadModules();

const { Executor } = require("@njs2/base");

/* External Package imports */
const app = express();
const upload = multer();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.any());

/* eslint-disable-next-line no-unused-vars */
app.get('/postman', (req, res) => {
  res.send(require('./postman.json'));
});

app.all("*", async (req, res) => {
  // Neutralize input parameter received from express for Executor.executeRequest
  let executorReq = {};
  executorReq.httpMethod = req.method;
  executorReq.queryStringParameters = req.query;
  executorReq.body = req.body;
  executorReq.pathParameters = {
    proxy: req.path.length ? req.path.slice(1) : req.path
  };
  executorReq.headers = req.headers;
  if(req.files && req.files.length) {
    if (req.files.length > 1 ) {
      return res.send({
        responseCode: 400,
        responseMessage: "Only one file upload at a time is allowed",
        responseData: {},
      })
  
    }
    req.files.forEach(file => {
      executorReq.body[file.fieldname] = {
        type: 'file',
        filename: file.originalname,
        contentType: file.mimetype,
        content: file.buffer
      }
    });
  }
  const executor = new Executor();
  const result = await executor.executeRequest(executorReq);
  return res.send(result);
});

const { API_PORT, API_ENDPOINT } = process.env;
// Start the server
server.listen(API_PORT, () => {
  console.log(`App listening on port ${API_PORT}`);
  console.log(`Postman endpoint: ${API_ENDPOINT}/postman`);
});
