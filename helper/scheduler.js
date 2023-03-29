const path = require("path");
const {SCHEDULER} = require(path.join(process.cwd(), "src/config/config.json"));
const baseAction = require("../base/baseAction.class");
const nodeCron = require("node-cron");
const cronParser = require("cron-parser");
const awsHelper = require("./awsHelper");

class Scheduler{
    static loadFunctions (){
        let functionArray =[];
        for (let packageName in SCHEDULER) {
          let mCronFunctions = SCHEDULER[packageName].mCron;
          if(packageName === "local"){
            mCronFunctions.forEach((mCronDetails) => {
              if (mCronDetails.active) {
                let functionInit = require(path.join(process.cwd(),
                "src/tasks/" +
                mCronDetails.name +
                ".task"));
                functionArray.push({
                  functionName: mCronDetails.name,
                  initFunction: functionInit,
                  initFunctionInterval: mCronDetails.time,
                  runInLambda: mCronDetails.runInLambda,
                });
              }
            });
          }else{
            mCronFunctions.forEach((mCronDetails) => {
              if (mCronDetails.active) {
                let functionInit =  baseAction.loadTask(packageName,mCronDetails);
                functionArray.push({
                  functionName: mCronDetails.name,
                  initFunction: functionInit,
                  initFunctionInterval: mCronDetails.time,
                  runInLambda: mCronDetails.runInLambda
                });
              }
            });
          }
          }
          return functionArray;
    }
    
    static loadInitScripts (initFunctionArray){
      let currentTime = Math.round(new Date().getTime()/1000);
      Promise.all(initFunctionArray.map(async functionDetail =>{
        if(currentTime%functionDetail.initFunctionInterval == 0){
          if(functionDetail.runInLambda) {
            awsHelper.executeFromLambda(functionDetail);
          } else {
            await functionDetail.initFunction();
          }
        }
      }));
  }

  static loadCronFunctions() {
    let functionArray = [];

    for(let cronName in SCHEDULER) {

      let crons = SCHEDULER[cronName].cron;

      if(!isValidCronDetails(crons)) continue;
  
      // Get cron details from current project 
      if(cronName === "local") {

        for(let cronDetails of crons) {
  
          if(cronDetails.active) {
            const cronPattern = cronDetails.time.split(" ");
            
            // Validating cron pattern
            if(cronPattern.length === 5 && nodeCron.validate(cronDetails.time)) {
              const nextInvokedAt = cronParser.parseExpression(cronDetails.time).prev()._date.weekData;
              const now = new Date();
              
              // Check for cron invoke time
              if(nextInvokedAt.hour === now.getHours() && nextInvokedAt.minute === now.getMinutes()) {
  
                const functionInit = require(`./src/tasks/${cronDetails.name}.task`);
                const functionDetails = {
                  initFunction: functionInit
                };
                functionArray.push(functionDetails);
              }
  
            } else {
              console.log(`${cronDetails.name} has an invalid pattern: ${cronDetails.time}!`);
            }
  
          }
        };

      } else {    // Get cron details from private plugins

        for(let cronDetails of crons) {
          if(cronDetails.active) {
            const functionInit = baseAction.loadTask(cronName, cronDetails)
            const functionDetails = {
              initFunction: functionInit
            };
            functionArray.push(functionDetails);
          }
        }

      }

    }

    return functionArray;
  }
  
  static loadCronInitScripts(cronInitArray) {
    Promise.all(cronInitArray.map(async functionDetails => {
      await functionDetails.initFunction();
    }))
  }

  static isValidCronDetails(crons) {
    return Array.isArray(crons);
  }
}

module.exports = Scheduler;