const path = require("path");
const {SCHEDULER} = require(path.join(process.cwd(), "src/config/config.json"));
const baseAction = require("../base/baseAction.class");
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
                  initFunction: functionInit,
                  initFunctionInterval: mCronDetails.time,
                });
              }
            });
          }else{
            mCronFunctions.forEach((mCronDetails) => {
              if (mCronDetails.active) {
                let functionInit =  baseAction.loadTask(packageName,mCronDetails);
                functionArray.push({
                  initFunction: functionInit,
                  initFunctionInterval: mCronDetails.time,
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
          await functionDetail.initFunction();
        }
      }));
  }
}

module.exports = Scheduler;