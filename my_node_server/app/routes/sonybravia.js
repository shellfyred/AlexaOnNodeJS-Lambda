const bodyParser = require("body-parser");
const express = require("express");
const config = require ("../config");
const Bravia = require("bravia");

let bravia = new Bravia(config.sony.ip, config.sony.port, config.sony.psk);

var router = express.Router();
router.use(bodyParser.json());

const checkApiKey = function(req, res, next) {
    console.log(req.headers);
    if (req.headers.apikey !== config.apiKey) {
        console.log("No API key supplied");
        res.send("Not authorized");
    } 
    else{
        next();
    }
}

router.post("/power", checkApiKey, function(req,res){
    var power = req.headers.power; 
    console.log("User request TV Power " + power);
    var powerintent = power == "on" ? "active" : "standby";
    console.log("User has requested that the TV turn " + powerintent);

    bravia.system.invoke("getPowerStatus")
        .then( data => {
            if (data.status == powerintent){
                res.send("The TV is already powered " + power);
            }
            else{
                bravia.send("TvPower")
                    .then(
                        res.send("I have switched the TV " + power)
                    )
                    .catch(error => console.error(error));
            }
        })
        .catch(error => {
            res.send("I cannot do that right now. Please try again");
        });
});

router.post("/videoinput", checkApiKey,function(req,res){
    var inputnumber = req.headers.inputnumber; 
    console.log("User request TV Input change to " + inputnumber);
    switch (inputnumber) {
      case "1": break;
      case "2": break;
      case "3": break;
      case "4": break;
      default :
        res.send("I had trouble finding that input.");
    }

    bravia.send("Hdmi" + inputnumber)
        .then(
            res.send("Input changed to HDMI " + inputnumber)
        )
        .catch(error => console.error(error));
});

router.post("/setvolume",function(req,res){
 
});

// respond with "hello world" when a GET request is made to the homepage
router.get("/", function(req, res) {
  res.send("Sony API");
});

//Export Module
module.exports = router;