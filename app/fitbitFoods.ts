import temboo = module("./temboo");
import express = module("express");

var fitbit = require("../node_modules/temboo/Library/Fitbit");

var searchFoodsChoreo = new fitbit.SearchFoods(temboo.session);

export function init(server) {
  server.get("/get-fitbit-foods", (request, response) => {
    var searchFoodsChoreo = new fitbit.SearchFoods(temboo.session);
    var searchFoodsInputs = searchFoodsChoreo.newInputSet();

    searchFoodsInputs.setCredential("FitbitCompleter");
    searchFoodsInputs.set_Format("json");
    searchFoodsInputs.set_Query(request.query.query);

    searchFoodsChoreo.execute(
      searchFoodsInputs,
      results => {
        var parsed = JSON.parse(results.get_Response());
        console.log("foods: " + parsed.foods);
        response.send({
          success: true,
          foods: parsed.foods
        });
      },
      error => {
        console.log("Failed to get food from Fitbit");
        response.send({ success: false, error: error });
      }
    );
  });
}

