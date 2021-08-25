const Executor = require("./base/executor.class");

const data = {
  httpMethod: 'GET',
  queryStringParameters: { data: 'vrYpkBFjyRBQVWquj7hGJYzyryl6GRpgJknbxHY9cmE=' },
  body: {},
  pathParameters: { proxy: 'user/details' },
  headers: {
    access_token: 'UHvobtGrzXVv6JrR+sJ3N1yOY2Fp4QWK9LN3fm1O4rZFdA9KVdocqJDX7NeicvnPc8A6Zd1/A8aRX9Jrx7aPInrTMT+Nzt7ranmhJoDD/Nsw1DL4Rq141Y6SpQYPfvdJZDI9VaI2aoDBiMwppOLk9MIZMOTIe4G9Kq97uKdNla0=',
    enc_state: '1',
    'user-agent': 'PostmanRuntime/7.26.8',
    accept: '*/*',
    'postman-token': '1898ca38-8811-4140-b0c6-fca7cee424dd',
    host: 'localhost:3000',
    'accept-encoding': 'gzip, deflate, br',
    connection: 'keep-alive'
  }
};

const test = async () => {
  const executor = new Executor();
  let response = await executor.executeRequest(executorReq);
  console.log(response);
};

test();