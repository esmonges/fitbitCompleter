import temboo = module("./temboo");
import express = module("express");

var fitbit = require("../node_modules/temboo/Library/Fitbit");

var searchFoodsChoreo = new fitbit.SearchFoods(temboo.session);

export function init(server) {
  server.get("/get-fitbit-exercises", (request, response) => {
    var browseActivitiesChoreo = new fitbit.SearchFoods(temboo.session);
    var browseActivitiesInputs = browseActivitiesChoreo.newInputSet();

    browseActivitiesInputs.setCredential("FitbitCompleter");
    browseActivitiesInputs.set_Format("json");
    browseActivitiesInputs.set_Query(request.query.query);

    browseActivitiesChoreo.execute(
      browseActivitiesInputs,
      results => {
        var parsed = JSON.parse(results.get_Response());
        console.log(parsed.exercises);
        response.send({
          success: true,
          exercises: parsed.exercises
        });
      },
      error => {
        console.log("Failed to get food from Fitbit");
        response.send({ success: false, error: error });
      }
    );
  });
}


