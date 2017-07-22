const sonybravia = require("./routes/sonybravia");
const config = require("./config");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.json());

app.use("/sonybravia", sonybravia);

app.get('/', function(req, res) {
  res.send('API Homepage works');
});

module.exports = app;