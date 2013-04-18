///<reference path='..\node\node.d.ts' />

// Adapted from http://typescript.codeplex.com/SourceControl/changeset/view/ac38ce9e29b3aeaa1beaebdae6729d0bc83ad231#samples/imageboard/app.ts

// TODO: Import all modules here
import http = module("http");
import url = module("url");
import express = module("express");

import database = module("./database");
import temboo = module("./temboo");
import foursquare = module("./foursquare");
import googlewalkingdistance = module("./googlewalkingdistance");
import fitbitOAuth = module("./fitbitOAuth");
import fitbitSteps = module("./fitbitSteps");
import fitbitFoods = module("./fitbitFoods");

var server = express.createServer();
server.use(express.bodyParser());
fitbitOAuth.init(server);
fitbitSteps.init(server);
fitbitFoods.init(server);
foursquare.init(server);
googlewalkingdistance.init(server);

// Routes
server.get("/", (request, response) => {
  response.sendfile("static/signin.html");
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

