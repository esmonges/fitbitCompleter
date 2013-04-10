

var express = require("express")

var temboo = require("./temboo")
var foursquare = require("./foursquare")
var googlewalkingdistance = require("./googlewalkingdistance")
var fitbitOAuth = require("../node_modules/temboo/Library/Fitbit/OAuth");
var fitbit = require("../node_modules/temboo/Library/Fitbit");
var server = express.createServer();
server.use(express.bodyParser());
foursquare.initFoursquare(server);
googlewalkingdistance.initGoogleWalkingDistance(server);
server.get("/", function (request, response) {
    response.sendfile("static/signin.html");
});
server.get("/static/:filename", function (request, response) {
    response.sendfile("static/" + request.params.filename);
});
server.get("/fitbit-oauth", function (request, response) {
    var initializeOAuthChoreo = new fitbitOAuth.InitializeOAuth(temboo.session);
    var initializeOAuthInputs = initializeOAuthChoreo.newInputSet();
    initializeOAuthInputs.set_AccountName("omer");
    initializeOAuthInputs.set_AppKeyName("FitbitCompleter");
    initializeOAuthInputs.set_AppKeyValue("61191725-521b-4900-a");
    initializeOAuthInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
    initializeOAuthInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");
    initializeOAuthInputs.set_ForwardingURL("http://fitbitcompleter.omerzach.com:3000/static/signedin.html");
    var success = function (results) {
        console.log("success");
        response.send({
            url: results.get_AuthorizationURL(),
            success: true
        });
        var finalizeOAuthChoreo = new fitbitOAuth.FinalizeOAuth(temboo.session);
        var finalizeOAuthInputs = finalizeOAuthChoreo.newInputSet();
        finalizeOAuthInputs.set_AccountName("omer");
        finalizeOAuthInputs.set_AppKeyName("FitbitCompleter");
        finalizeOAuthInputs.set_AppKeyValue("61191725-521b-4900-a");
        finalizeOAuthInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
        finalizeOAuthInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");
        finalizeOAuthInputs.set_OAuthTokenSecret(results.get_OAuthTokenSecret());
        finalizeOAuthInputs.set_CallbackID(results.get_CallbackID());
        finalizeOAuthChoreo.execute(finalizeOAuthInputs, function (results2) {
            console.log(results2);
            var getActivitiesChoreo = new fitbit.GetActivities(temboo.session);
            var getActivitiesInputs = getActivitiesChoreo.newInputSet();
            getActivitiesInputs.set_AccessToken(results2.get_AccessToken());
            getActivitiesInputs.set_AccessTokenSecret(results2.get_AccessTokenSecret());
            getActivitiesInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
            getActivitiesInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");
            getActivitiesInputs.set_Date("2013-04-08");
            getActivitiesInputs.set_Format("json");
            getActivitiesChoreo.execute(getActivitiesInputs, function (results3) {
                return console.log(results3.get_Response());
            }, function (error) {
                return console.log(error);
            });
        }, function (error) {
            return console.log(error.type);
        });
    };
    initializeOAuthChoreo.execute(initializeOAuthInputs, success, function (error) {
        console.log("error");
        response.send({
            error: error,
            success: false
        });
    });
});
server.listen(3000, function () {
    console.log("Express server listening on port %d in %s mode", 3000, server.settings.env);
    console.log(temboo.session);
});
exports.Server = server;
