// DO NOT CHANGE THE BODY OF THIS FILE
// This file will be used by the Crontab to execute your configured Scheduled Jobs
// <cron pattern> <path to nodejs executable>/node <path to this tasks file>/tasks <filename of the task without task.js>
// e.g.: * * * * *  /path to nodejs/node /path to project/tasks.js testTask"
(() => {
    try {
         const commandLineAruments = process.argv.slice(2);
         // expect 3rd argument to be the filename of the job
         // require it to extract the default function from that file
         const task = require(`./src/tasks/${commandLineAruments[0]}.task.js`);
         // execute the default function
         task();
    } catch (error) {
        console.error(error)
    }
 })();