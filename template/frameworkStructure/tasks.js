// DO NOT CHANGE THE BODY OF THIS FILE
// This file will be used by the Crontab to execute your configured Scheduled Jobs
// e.g.: */10 * * * * * /usr/local/bin/node "/Users/Admin/Desktop/Test Projects/njs2-ludo-main/tasks.js leaderboardUpdate"
// above example is formatted as follows:
// <cron pattern> <path to nodejs executable>/node <path to this tasks file>/tasks <filename of the task without task.js>
(() => {
    try {
         const commandLineAruments = process.argv.slice(2);
         // expect 3rd argument to the filename of the cron
         // require it to extract the default function in that file
         const task = require(`./src/tasks/${commandLineAruments[0]}.task.js`);
         // execute the default function
         task();
    } catch (error) {
        console.error(error)
    }
 })();