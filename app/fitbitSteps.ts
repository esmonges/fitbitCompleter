import temboo = module("./temboo");
import express = module("express");

var fitbit = require("../node_modules/temboo/Library/Fitbit");
//var fitbitFoods = require("../node_modules/temboo/Library/Fitbit/Foods");

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
    month = "0" + (today.getMonth()).toString();
  } else {
    month = (today.getMonth() + 1).toString();
  }

  var year = today.getFullYear().toString();
  return "" + year + "-" + month + "-" + day;
}

export function init(server) {
  server.get("/get-fitbit-data", (request, response) => {
    var getActivitiesChoreo = new fitbit.GetActivities(temboo.session);

    // Instantiate and populate the input set for the choreo
    var getActivitiesInputs = getActivitiesChoreo.newInputSet();

    // Set inputs
    getActivitiesInputs.set_AccessToken(request.query["accessToken"]);
    console.log(request.query["accessToken"]);
    getActivitiesInputs.set_AccessTokenSecret(request.query["accessTokenSecret"]);
    console.log(request.query["accessTokenSecret"]);
    getActivitiesInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
    getActivitiesInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");
    getActivitiesInputs.set_Date(getCurrentFitbitDate());
    console.log(getCurrentFitbitDate());
    getActivitiesInputs.set_Format("json");

    // Run the choreo, specifying success and error callback handlers
    getActivitiesChoreo.execute(
      getActivitiesInputs,
      results => {
        var fitbitActivities = JSON.parse(results.get_Response());
        var stepsPerMile;
        if (fitbitActivities["summary"]["distances"][0]["distance"] === 0) {
          // TODO: Should use previous day's data instead
          stepsPerMile = 1000;
        } else {
          stepsPerMile = (fitbitActivities["summary"]["steps"]) / fitbitActivities["summary"]["distances"][0]["distance"];
        }
        response.send({
          success: true,
          goalSteps: fitbitActivities["goals"]["steps"],
          actualSteps: fitbitActivities["summary"]["steps"],
          stepsPerMile: stepsPerMile,
          caloriesGoal: fitbitActivities["goals"]["caloriesOut"],
          actualCalories: fitbitActivities["summary"]["caloriesOut"]
        });

        //console.log("Net Calories Goal: " + fitbitActivities["goals"]["caloriesOut"]);
        //console.log("Actual Net Calories: " + fitbitActivities["summary"]["caloriesOut"]);
      },
      error => response.send({ success: false, error: error })
    );
  });

/*
  server.get("/get-foods-data", (request, response) => {
    var getFoodGoalChoreo = new fitbitFoods.GetFoodGoal(temboo.session);
    var getFoodGoalInputs = new getFoodGoalChoreo.newInputSet();

    getFoodGoalChoreo.execute(
      getFoodGoalInputs,
      results => {
        var calorieData = JSON.parse(results.get_Response());

        response.send({
          success: true,
          data: calorieData
        });
      },
      error => {
        response.send({ success: false, error: error});
      }
    );
  });
*/

}

