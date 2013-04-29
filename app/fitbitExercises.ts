import temboo = module("./temboo");
import express = module("express");

var fitbit = require("../node_modules/temboo/Library/Fitbit/Activities");

export function init(server) {
  server.get("/get-fitbit-exercises", (request, response) => {
    var browseActivitiesChoreo = new fitbit.BrowseActivities(temboo.session);
    var browseActivitiesInputs = browseActivitiesChoreo.newInputSet();

    browseActivitiesInputs.set_AccessToken(request.query["accessToken"]);
    browseActivitiesInputs.set_AccessTokenSecret(request.query["accessTokenSecret"]);
    browseActivitiesInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
    browseActivitiesInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");

    browseActivitiesChoreo.execute(
      browseActivitiesInputs,
      results => {
        var parsed = JSON.parse(results.get_Response());
        response.send({
          success: true,
          exercises: parsed.categories[11].activities
        });
      },
      error => {
        console.log("Failed to get activities from Fitbit");
        response.send({ success: false, error: error });
      }
    );
  });

  server.put("/log-fitbit-exercise", (request, response) => {
    var logActivityChoreo = new fitbit.LogActivity(temboo.session);
    var logActivityInputs = logActivityChoreo.newInputSet();

    logActivityInputs.set_AccessToken(request.query["accessToken"]);
    logActivityInputs.set_AccessTokenSecret(request.query["accessTokenSecret"]);
    logActivityInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
    logActivityInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");
    logActivityInputs.set_ActivityID(request.body.activityId);
    logActivityInputs.set_Date(request.body.date); // TODO: Just use current date?
    if (request.body.distance !== undefined) /* TODO */ {
      logActivityInputs.set_Distance(request.body.distance);
    }
    logActivityInputs.set_DistanceUnit("Mile");
    logActivityInputs.set_Duration(request.body.seconds * 1000);
    logActivityInputs.set_StartTime(request.body.startTime); // TODO: Careful to get formatting right

    logActivityChoreo.execute(
      logActivityInputs,
      results => response.send({ success: true }),
      error => {
        console.log("Failed to log activity from Fitbit");
        response.send({ success: false, error: error });
      }
    );
  });
}

