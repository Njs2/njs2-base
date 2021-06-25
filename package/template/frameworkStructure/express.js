require('bytenode');
const express = require('express');
const http = require('http');

const Executor = require("njs2-base/base/executor.class");
const app = express();

const server = http.createServer(app);
// to support JSON-encoded bodies
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.all("*", async (req, res) => {

  let event = {};
  event.httpMethod = req.method;
  event.queryStringParameters = req.query;
  event.body = req.body;
  event.path = req.path;

  const executor = new Executor();
  await executor.executeMethod(event);
  return res.send(executor.getResponse());
});

// Start the server
server.listen(process.env.API_PORT, () => {
  console.log(`App listening on port ${process.env.API_PORT}`);
});
