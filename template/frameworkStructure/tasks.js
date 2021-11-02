// DO NOT CHANGE THE BODY OF THIS FILE
// This file is being used by the Crontab to execute your scheduled jobs
(() => {
    try {
         // to run the tasks via the Crontab, this file will be used
         // e.g.: * * * * * node <path to current tasks file>/tasks <filename of the task without task.js>
         var commandLineAruments = process.argv.slice(2);
         // TODO: to resolve the correct task file, append src/tasks/<commandLineAruments[0]>.task.js
         const task = require(`./src/tasks/${commandLineAruments[0]}.task.js`);
         // execute the default function
         task();
    } catch (error) {
        console.error(error)
    }
 })();