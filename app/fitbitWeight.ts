import temboo = module("./temboo");
import express = module("express");

var fitbit = require("../node_modules/temboo/Library/Fitbit/Body");

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
  return "" + year + "-" + month + "-" + day + "/1m"; // TODO
}

export function init(server) {
  server.get("/get-fitbit-weight", (request, response) => {
    var getBodyWeightChoreo = new fitbit.GetBodyWeight(temboo.session);

    var getBodyWeightInputs = getBodyWeightChoreo.newInputSet();
    getBodyWeightInputs.set_AccessToken(request.query["accessToken"]);
    getBodyWeightInputs.set_AccessTokenSecret(request.query["accessTokenSecret"]);
    getBodyWeightInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
    getBodyWeightInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");
    getBodyWeightInputs.set_Date(getCurrentFitbitDate());

    getBodyWeightChoreo.execute(
      getBodyWeightInputs,
      results => {
        var parsed = JSON.parse(results.get_Response());
        console.log(parsed);

        if(!parsed.weight[0]){
          parsed.weight[0] = {};
          parsed.weight[0].weight = undefined;
        }

        response.send({
          success: true,
          weight: parsed.weight[0].weight
        });
      },
      error => response.send({ success: false, error: error })
    );
  });
};

