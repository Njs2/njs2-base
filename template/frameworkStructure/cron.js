const scheduler = require("@njs2/base/helper/scheduler");

const functionArray = scheduler.loadCronFunctions();

scheduler.loadCronInitScripts(functionArray);