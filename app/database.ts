// Influenced by http://typescript.codeplex.com/SourceControl/changeset/view/ac38ce9e29b3aeaa1beaebdae6729d0bc83ad231#samples/imageboard/db.ts

import mongodb = module("mongodb");

var server = new mongodb.Server(
  "localhost",
  27017, // Any reason for this port
  { auto_reconnect: true },
  {}
)

var db = new mongodb.Db("mydb", server);
db.open(function() {});

// TODO: Interfaces for things that go in the database

