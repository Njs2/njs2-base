let sceduler = require("@njs2/base/helper/scheduler");
let functionArray = sceduler.loadFunctions();
setInterval(async () => {
  try {
    sceduler.loadInitScripts(functionArray);     
  } catch {}
}, 1000);