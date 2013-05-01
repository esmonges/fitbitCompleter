var mongodb = require("mongodb")
var server = new mongodb.Server("localhost", 27017, {
    auto_reconnect: true
}, {
});
exports.db = new mongodb.Db("db", server);
exports.db.open(function () {
});
function getActivities(callback) {
    exports.db.collection("activities", function (error, activities_collection) {
        if(error) {
            throw error;
        }
        activities_collection.find({
        }).toArray(function (error, activity_objects) {
            if(error) {
                throw error;
            }
            callback(activity_objects);
        });
    });
}
exports.getActivities = getActivities;
