const path = require("path");
const {SCHEDULER} = require(path.join(process.cwd(), "src/config/config.json"));
class Scheduler{
    static loadFunctions (){
        let functionArray =[];
        for (let packageName in SCHEDULER) {
            let mCronFunctions = SCHEDULER[packageName].mCron;
            mCronFunctions.forEach((mCronDetails) => {
              if (mCronDetails.active) {
                let functionInit = require(path.join(process.cwd(),"njs2_modules/" +
                  packageName +
                  "/task/" +
                  mCronDetails.name +
                  ".task"));
                functionArray.push({
                  initFunction: functionInit,
                  initFunctionInterval: mCronDetails.time,
                });
              }
            });
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