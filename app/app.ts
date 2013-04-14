///<reference path='..\node\node.d.ts' />

// Adapted from http://typescript.codeplex.com/SourceControl/changeset/view/ac38ce9e29b3aeaa1beaebdae6729d0bc83ad231#samples/imageboard/app.ts

// TODO: Import all modules here
import http = module("http");
import url = module("url");
import express = module("express");

import database = module("./database");
import temboo = module("./temboo");
import foursquare = module("./foursquare");
import googlewalkingdistance = module("./googlewalkingdistance")

var fitbitOAuth = require("../node_modules/temboo/Library/Fitbit/OAuth");
var fitbit = require("../node_modules/temboo/Library/Fitbit");

var server = express.createServer();
server.use(express.bodyParser());
foursquare.initFoursquare(server);
googlewalkingdistance.initGoogleWalkingDistance(server);

// Routes
server.get("/", (request, response) => {
  response.sendfile("static/signin.html");
});


server.get("/finalize-fitbit-oauth", (request, response) => {
  var oauthTokenSecret = request.query["oauthTokenSecret"];
  var callbackId = request.query["callbackId"];

  var finalizeOAuthChoreo = new fitbitOAuth.FinalizeOAuth(temboo.session);

  // Instantiate and populate the input set for the choreo
  var finalizeOAuthInputs = finalizeOAuthChoreo.newInputSet();

  // Set inputs
  finalizeOAuthInputs.set_AccountName("omer");
  finalizeOAuthInputs.set_AppKeyName("FitbitCompleter");
  finalizeOAuthInputs.set_AppKeyValue("61191725-521b-4900-a");
  finalizeOAuthInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
  finalizeOAuthInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");
  finalizeOAuthInputs.set_OAuthTokenSecret(oauthTokenSecret);
  finalizeOAuthInputs.set_CallbackID(callbackId);

  // Run the choreo, specifying success and error callback handlers
  finalizeOAuthChoreo.execute(
    finalizeOAuthInputs,
    results => {
      console.log(results);
      response.send({
        success: true,
        accessToken: results.get_AccessToken(),
        accessTokenSecret: results.get_AccessTokenSecret(),
        userId: results.get_UserID()
      });

      /*
      var getActivitiesChoreo = new fitbit.GetActivities(temboo.session);

      // Instantiate and populate the input set for the choreo
      var getActivitiesInputs = getActivitiesChoreo.newInputSet();

      // Set inputs
      getActivitiesInputs.set_AccessToken(results.get_AccessToken());
      getActivitiesInputs.set_AccessTokenSecret(results.get_AccessTokenSecret());
      getActivitiesInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
      getActivitiesInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");
      getActivitiesInputs.set_Date("2013-04-08");
      getActivitiesInputs.set_Format("json");

      // Run the choreo, specifying success and error callback handlers
      getActivitiesChoreo.execute(
        getActivitiesInputs,
        results2 => {
          var fitbitActivities = JSON.parse(results2.get_Response());
          var stepsPerMile = (response["summary"]["steps"]) / response["summary"]["distances"][0]["distance"]);
          response.send({
            success: true,
            goalSteps: response["goals"]["steps"],
            actualSteps: response["summary"]["steps"],
            stepsPerMile: stepsPerMile
          });

          //console.log("Net Calories Goal: " + response["goals"]["caloriesOut"]);
          //console.log("Actual Net Calories: " + response["summary"]["caloriesOut"]);
        },
        error => response.send({ success: false, error: error })
      );
      */
    },
    error => response.send({ success: false, error: error })
  );
});

server.get("/init-fitbit-oauth", (request, response) => {
  var initializeOAuthChoreo = new fitbitOAuth.InitializeOAuth(temboo.session);

  var initializeOAuthInputs = initializeOAuthChoreo.newInputSet();

  // Set inputs
  // TODO: Move these constants somewhere nicer
  initializeOAuthInputs.set_AccountName("omer");
  initializeOAuthInputs.set_AppKeyName("FitbitCompleter");
  initializeOAuthInputs.set_AppKeyValue("61191725-521b-4900-a");
  initializeOAuthInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
  initializeOAuthInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");
  initializeOAuthInputs.set_ForwardingURL("http://fitbitcompleter.omerzach.com:3000/signedin.html");

  var success = results => {
    console.log("success");
    response.send({
      url: results.get_AuthorizationURL(),
      oauthTokenSecret: results.get_OAuthTokenSecret(),
      callbackId: results.get_CallbackID(),
      success: true
    });
  }

  // Run the choreo, specifying success and error callback handlers
  initializeOAuthChoreo.execute(
    initializeOAuthInputs,
    success,
    error => {
      console.log("error");
      response.send({ error: error, success: false });
    }
  );
});

server.get("/:filename", (request, response) => {
  response.sendfile("static/" + request.params.filename);
});

server.get("/static/:filename", (request, response) => {
  response.sendfile("static/" + request.params.filename);
});

server.listen(3000, () => {
  console.log(
    "Express server listening on port %d in %s mode",
    3000,
    server.settings.env
  );
  console.log(temboo.session);
});

export var Server = server;

