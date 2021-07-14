require('bytenode');
const express = require('express');
const http = require('http');

const Executor = require("@njs2/base/base/executor.class");
const app = express();
let multer = require('multer');
let upload = multer();

const server = http.createServer(app);
// to support JSON-encoded bodies
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(upload.any());

app.get('/postman', (req, res) => {
  res.send(require('./postman.json'));
});

app.all("*", async (req, res) => {
  let event = {};
  event.httpMethod = req.method;
  event.queryStringParameters = req.query;
  event.body = req.body;
  event.pathParameters = {
    proxy: req.path.length ? req.path.slice(1) : req.path
  };
  event.headers = req.headers;

  if (req.files)
    req.files.forEach(file => {
      event.body[file.fieldname] = {
        type: 'file',
        filename: file.originalname,
        contentType: file.mimetype,
        content: file.buffer
      }
    });

  const executor = new Executor();
  await executor.executeMethod(event);
  return res.send(executor.getResponse());
});

// Start the server
server.listen(process.env.API_PORT, () => {
  console.log(`App listening on port ${process.env.API_PORT}`);
});

require('@njs2/base').sockets.init();
