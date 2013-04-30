import temboo = module("./temboo");
import express = module("express");

var fitbit = require("../node_modules/temboo/Library/Fitbit/Activities");
import activities = module("./activities");

var getCurrentFitbitDate = (): string => {
  var today = new Date();
  var day;
  if (today.getDate() < 10) {
    day = "0" + (today.getDate().toString());
  } else {
    day = today.getDate().toString();
  }

  var month;
  if ((today.getMonth() + 1) < 10) {
    month = "0" + (today.getMonth() + 1).toString();
  } else {
    month = (today.getMonth() + 1).toString();
  }

  var year = today.getFullYear().toString();
  return "" + year + "-" + month + "-" + day;
}


export function init(server) {
  server.get("/get-fitbit-exercises", (request, response) => {
    try {
      activities.getActivities(activities => {
        console.log(activities);
        response.send({
          success: true,
          exercises: activities
        });
      });
    } catch (error) {
      response.send({ success: false, error: error });
    }
  });

  server.put("/log-fitbit-exercise", (request, response) => {
    var logActivityChoreo = new fitbit.LogActivity(temboo.session);
    var logActivityInputs = logActivityChoreo.newInputSet();

    logActivityInputs.set_AccessToken(request.body.accessToken);
    logActivityInputs.set_AccessTokenSecret(request.body.accessTokenSecret);
    logActivityInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
    logActivityInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");
    logActivityInputs.set_ActivityID(request.body.activityId);
    logActivityInputs.set_Date(getCurrentFitbitDate());
    logActivityInputs.set_Duration(request.body.duration * 60 * 1000);
    logActivityInputs.set_StartTime(request.body.startTime); // TODO: Careful to get formatting right

    console.log(request.body);
    console.log(logActivityInputs);

    logActivityChoreo.execute(
      logActivityInputs,
      results => response.send({ success: true }),
      error => {
        console.log("Failed to log activity to Fitbit");
        response.send({ success: false, error: error });
      }
    );
  });
}

