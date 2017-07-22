
/**
 * App ID for the skill
 */

var AlexaSkill = require('./AlexaSkill');
var https = require('https')
var config = require('./config');


var App = function () {
    AlexaSkill.call(this, config.Appid);
};

// Extend AlexaSkill
App.prototype = Object.create(AlexaSkill.prototype);
App.prototype.constructor = App;

App.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("App onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

App.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("App onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the TV Controls, I can control the TV for you.";
    var repromptText = "You can say change channel to with the name of the channel.";
    response.ask(speechOutput, repromptText);
};

App.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("App onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

App.prototype.intentHandlers = {
    // register custom intent handlers

    HelpIntent: function (intent, session, response) {
        response.ask("You can tell the TV to turn off and on, and request for various channels.");
    },

    TVPowerIntent: function (intent, session, response) {
        var header = {'power': intent.slots.power.value};//pulls variable from intent

        sendCommand("/sonybravia/power",header,null,function ResponseCallback(res) {
            console.log(res);
            response.tell(res);
        });           
    },

    VideoInputIntent: function (intent, session, response) {
        inputnumber = intent.slots.inputnumber.value;  //grab input value from user request
        var header = {'inputnumber': inputnumber};

        sendCommand("/sonybravia/videoinput",header,null,function ResponseCallback(res) {
            console.log(res);
            response.tell(res);
        });      
    }
};

function sendCommand(path,header,body,callback) {
    header.apiKey = config.apiKey;
    var opt = {
        host:config.host,
        port:config.port,
        path: path,
        method: 'POST',
        headers: header,
    };

    var req = https.request(opt, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
            callback(chunk);
        });
    });

    if (body) req.write(body);
    req.end();
};


// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the App skill.
    var app = new App();
    app.execute(event, context);
};

