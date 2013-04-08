///<reference path='..\node\node.d.ts' />

// Adapted from http://typescript.codeplex.com/SourceControl/changeset/view/ac38ce9e29b3aeaa1beaebdae6729d0bc83ad231#samples/imageboard/app.ts

// TODO: Import all modules here
import http = module("http");
import url = module("url")
import express = module("express");

import database = module("./database");
import temboo = module("./temboo");

var server = express.createServer();


// Routes
server.get("/", function(request, response) {
  response.sendfile("static/index.html");
});

server.listen(3000, function() {
  console.log(
    "Express server listening on port %d in %s mode",
    3000,
    server.settings.env
  );
});

export var Server = server;

