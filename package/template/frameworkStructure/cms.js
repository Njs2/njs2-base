require('njs2-base/base/env');
const express = require('express');
const reactApp = express();
reactApp.use(express.static("cms/build"));
reactApp.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "cms/build", "index.html"));
});

const init = () => {
  reactApp.listen(process.env.CMS_PORT, () => {
    console.log(`CMS server started on port ${process.env.CMS_PORT}`);
  });
}

module.exports.init = init;
