var temboo = require("./temboo")

var fitbit = require("../node_modules/temboo/Library/Fitbit/Activities");
var activities = require("./activities")
var getCurrentFitbitDate = function () {
    var today = new Date();
    var day;
    if(today.getDate() < 10) {
        day = "0" + (today.getDate().toString());
    } else {
        day = today.getDate().toString();
    }
    var month;
    if((today.getMonth() + 1) < 10) {
        month = "0" + (today.getMonth() + 1).toString();
    } else {
        month = (today.getMonth() + 1).toString();
    }
    var year = today.getFullYear().toString();
    return "" + year + "-" + month + "-" + day;
};
function init(server) {
    server.get("/get-fitbit-exercises", function (request, response) {
        try  {
            activities.getActivities(function (activities) {
                console.log(activities);
                response.send({
                    success: true,
                    exercises: activities
                });
            });
        } catch (error) {
            response.send({
                success: false,
                error: error
            });
        }
    });
    server.put("/log-fitbit-exercise", function (request, response) {
        var logActivityChoreo = new fitbit.LogActivity(temboo.session);
        var logActivityInputs = logActivityChoreo.newInputSet();
        logActivityInputs.set_AccessToken(request.body.accessToken);
        logActivityInputs.set_AccessTokenSecret(request.body.accessTokenSecret);
        logActivityInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
        logActivityInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");
        logActivityInputs.set_ActivityID(request.body.activityId);
        logActivityInputs.set_Date(getCurrentFitbitDate());
        logActivityInputs.set_Duration(request.body.duration * 60 * 1000);
        logActivityInputs.set_StartTime(request.body.startTime);
        console.log(request.body);
        console.log(logActivityInputs);
        logActivityChoreo.execute(logActivityInputs, function (results) {
            return response.send({
                success: true
            });
        }, function (error) {
            console.log("Failed to log activity to Fitbit");
            response.send({
                success: false,
                error: error
            });
        });
    });
}
exports.init = init;
