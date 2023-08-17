const serverlessExpress = require('serverless-http')
const express = require('express')
const multer = require('multer');
const app = express()
const upload = multer();
 
const websockets = require('./websockets');
const { Executor } = require("@njs2/base");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.any());


app.all('*', async function (req, res) {

  console.log("INSIDE LAMBDA BODY")

  const {event} = req.apiGateway
  let result = "All Ok!"

  try {
    const requestType = event.stageVariables.requestType;
    console.log("INSIDE LAMBDA requestType: ", requestType)

    if (requestType === 'API') {
      result = await lambdaExecutor(event)
    } else if (requestType === 'Socket') {
      result = await websockets.handler(event);
    } else if (requestType === 'scheduler') {
      const taskName = event.stageVariables.taskName;
      const task = require(`./src/tasks/${taskName}.task.js`);
      task();
    }
    res.send({...result})
  } catch(error) {
    console.error(error)
    res.send({
      responseCode: 200,
      responseMessage: "Something went wrong!",
      responseData: {}
    })
  }
})

exports.handler = serverlessExpress(app)

async function lambdaExecutor(eventObject) {
  try {
    const { httpMethod, queryStringParameters, path, files, body, headers } = eventObject
    // Neutralize input parameter received from express for Executor.executeRequest
    let executorReq = {};
    executorReq.httpMethod = httpMethod;
    executorReq.queryStringParameters = queryStringParameters;
    executorReq.body = body;
    executorReq.pathParameters = {
        proxy: path.length ? path.slice(1) : path
    };
    executorReq.headers = headers;
    if (files && files.length) {
        if (files.length > 1) throw new Error("Only one file upload at a time is allowed")
        files.forEach(file => {
            executorReq.body[file.fieldname] = {
                type: 'file',
                filename: file.originalname,
                contentType: file.mimetype,
                content: file.buffer
            };
        });
    }
    const executor = new Executor();
    return await executor.executeRequest(executorReq);
  } catch (error) {
    throw error
  }
}