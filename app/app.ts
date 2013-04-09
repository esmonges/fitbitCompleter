///<reference path='..\node\node.d.ts' />

// Adapted from http://typescript.codeplex.com/SourceControl/changeset/view/ac38ce9e29b3aeaa1beaebdae6729d0bc83ad231#samples/imageboard/app.ts

// TODO: Import all modules here
import http = module("http");
import url = module("url")
import express = module("express");

import database = module("./database");
import temboo = module("./temboo");
import foursquare = module("./foursquare");

var fitbit = require("../node_modules/temboo/Library/Fitbit/OAuth");

var server = express.createServer();
//server.use(express.bodyParser()); //ts doesn't like this, gets rid of () on compilation
foursquare.initFS(server);


// Routes
server.get("/", function(request, response) {
  response.sendfile("static/signin.html");
});

server.get("/static/:filename", function(request, response) {
  response.sendfile("static/" + request.params.filename);
});

server.get("/fitbit-oauth", function(request, response) {
  var initializeOAuthChoreo = new fitbit.InitializeOAuth(temboo.session);

  var initializeOAuthInputs = initializeOAuthChoreo.newInputSet();

  // Set inputs
  // TODO: Move these constants somewhere nicer
  initializeOAuthInputs.set_AccountName("omer");
  initializeOAuthInputs.set_AppKeyName("FitbitCompleter");
  initializeOAuthInputs.set_AppKeyValue("61191725-521b-4900-a");
  initializeOAuthInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
  initializeOAuthInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");
  console.log(initializeOAuthInputs);
  // TODO: Forwarding URL

  // Run the choreo, specifying success and error callback handlers
  initializeOAuthChoreo.execute(
    initializeOAuthInputs,
    function(results) {
      console.log("success");
      response.send({
        url: results.get_AuthorizationURL(),
        success: true
      });
    },
    function(error) {
      console.log("error");
      response.send({
        error: error,
        success: false
      });
    }
  );
});


server.listen(3000, function() {
  console.log(
    "Express server listening on port %d in %s mode",
    3000,
    server.settings.env
  );
  console.log(temboo.session);
});

export var Server = server;

