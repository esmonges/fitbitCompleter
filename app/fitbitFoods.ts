import temboo = module("./temboo");
import express = module("express");

var fitbit = require("../node_modules/temboo/Library/Fitbit");

// TODO: Consolidate with other identical functions!
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
  return "" + year + "-" + month + "-" + day; // TODO
}

var convertMealTypeToId = function(mealType) {
  switch (mealType) {
    case "Breakfast": return 1;
    case "Morning Snack": return 2;
    case "Lunch": return 3;
    case "Afternoon Snack": return 4;
    case "Dinner": return 5;
    // THERE IS NO 6
    case "Anytime": return 7;
    default: throw new Error;
  }
}

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

    logFoodInputs.set_AccessToken(request.body.accessToken);
    logFoodInputs.set_AccessTokenSecret(request.body.accessTokenSecret);
    logFoodInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
    logFoodInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");
    logFoodInputs.set_Amount(request.body.amount);
    logFoodInputs.set_Date(getCurrentFitbitDate());
    logFoodInputs.set_MealType(request.body.mealType);
    logFoodInputs.set_FoodId(request.body.foodId);
    logFoodInputs.set_UnitId(request.body.unitId);

    logFoodChoreo.execute(
      logFoodInputs,
      results => response.send({ success: true }),
      error => {
        console.log("Failed to log food to Fitbit");
        response.send({ success: false, error: error });
      }
    );
  });
}

