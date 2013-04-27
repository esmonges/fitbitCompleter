var mongodb = require("mongodb")
var server = new mongodb.Server("localhost", 27017, {
    auto_reconnect: true
}, {
});
var db = new mongodb.Db("mydb", server);
db.open(function () {
});
