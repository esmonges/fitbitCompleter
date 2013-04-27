

var express = require("express")

var temboo = require("./temboo")
var foursquare = require("./foursquare")
var googlewalkingdistance = require("./googlewalkingdistance")
var fitbitOAuth = require("./fitbitOAuth")
var fitbitSteps = require("./fitbitSteps")
var fitbitFoods = require("./fitbitFoods")
var fitbitExercises = require("./fitbitExercises")
var fitbitWeight = require("./fitbitWeight")
var server = express.createServer();
server.use(express.bodyParser());
fitbitOAuth.init(server);
fitbitSteps.init(server);
fitbitFoods.init(server);
fitbitExercises.init(server);
fitbitWeight.init(server);
foursquare.init(server);
googlewalkingdistance.init(server);
server.get("/", function (request, response) {
    response.sendfile("static/signin.html");
});
server.get("/:filename", function (request, response) {
    response.sendfile("static/" + request.params.filename);
});
server.get("/static/:filename", function (request, response) {
    response.sendfile("static/" + request.params.filename);
});
server.listen(3000, function () {
    console.log("Express server listening on port %d in %s mode", 3000, server.settings.env);
    console.log(temboo.session);
});
exports.Server = server;
