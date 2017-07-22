const app = require("./app");
const config = require("./app/config.js");
const port = config.port || 3000;

app.listen(port, function (err) {
  if (err) {
    throw err;
  }

  console.log(`server is listening on ${port}...`);
});