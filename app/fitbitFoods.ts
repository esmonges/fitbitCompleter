import temboo = module("./temboo");
import express = module("express");

var fitbit = require("../node_modules/temboo/Library/Fitbit");

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

  server.put("/log-fitbit-food", (request, response) => {
    var logFoodChoreo = new fitbit.LogFood(temboo.session);
    var logFoodInputs = logFoodChoreo.newInputSet();

    logFoodInputs.set_AccessToken(request.query["accessToken"]);
    logFoodInputs.set_AccessTokenSecret(request.query["accessTokenSecret"]);
    logFoodInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
    logFoodInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");
    logFoodInputs.set_Amount(request.body.amount);
    logFoodInputs.set_Date(request.body.date); // TODO: Just use current date?
    logFoodInputs.set_FoodID(request.body.foodId);
    logFoodInputs.set_MealType(request.body.mealType);
    logFoodInputs.set_UnitID(request.body.unitId);

    logFoodChoreo.execute(
      logFoodInputs,
      results => response.send({ success: true }),
      error => {
        console.log("Failed to log food from Fitbit");
        response.send({ success: false, error: error });
      }
    );
  });
}

