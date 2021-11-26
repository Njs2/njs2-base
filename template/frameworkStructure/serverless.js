// Import and load env files
AutoLoad = require("@njs2/base/base/autoload.class");
AutoLoad.loadConfig();
AutoLoad.loadModules();

// Import Executor class
const Executor = require("@njs2/base/base/executor.class");

module.exports.execute = async (event) => {
  try {
    let fileCount = 0;
    if (event.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      const querystring = require("querystring");
      event.body = querystring.parse(event.body);
    }

    if (
      event.headers["Content-Type"] &&
      event.headers["Content-Type"].indexOf("multipart/form-data") === 0
    ) {
     
      if(event.body.match(/filename/g)){  
        fileCount = event.body.match(/filename/g).length
       }else{
         return {
           statusCode: 200,
           headers: {
             "Access-Control-Allow-Origin": "*",
             "Access-Control-Allow-Credentials": true,
           },
           body: JSON.stringify({
             responseCode: 400,
             responseMessage: "No File Found !!", 
             responseData: {},
           }),
         };
       }
      if (fileCount == 1) {
        const multipart = require("aws-multipart-parser");
        event.body = multipart.parse(event, true);
      } else {
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            responseCode: 400,
            responseMessage: "Only one file upload at a time is allowed", 
            responseData: {},
          }),
        };
      }
    }
    const executor = new Executor();
    const response = await executor.executeRequest(event);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(response),
    };
  } catch (e) {
    console.log(e);
  }
};
