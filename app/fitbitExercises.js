var temboo = require("./temboo")

var fitbit = require("../node_modules/temboo/Library/Fitbit/Activities");
var browseActivitiesChoreo = new fitbit.BrowseActivities(temboo.session);
function init(server) {
    server.get("/get-fitbit-exercises", function (request, response) {
        var browseActivitiesChoreo = new fitbit.BrowseActivities(temboo.session);
        var browseActivitiesInputs = browseActivitiesChoreo.newInputSet();
        browseActivitiesInputs.set_AccessToken(request.query["accessToken"]);
        browseActivitiesInputs.set_AccessTokenSecret(request.query["accessTokenSecret"]);
        browseActivitiesInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
        browseActivitiesInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");
        browseActivitiesChoreo.execute(browseActivitiesInputs, function (results) {
            var parsed = JSON.parse(results.get_Response());
            response.send({
                success: true,
                exercises: parsed.categories[11].activities
            });
        }, function (error) {
            console.log("Failed to get activities from Fitbit");
            response.send({
                success: false,
                error: error
            });
        });
    });
}
exports.init = init;
