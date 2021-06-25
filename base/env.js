const fs = require('fs');
const path = require("path");

const envConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), `/src/config/config.json`)));

for (const k in envConfig) {
  if (!process.env[k] || process.env[k].length == 0) {
    process.env[k] = envConfig[k];
  }
}
