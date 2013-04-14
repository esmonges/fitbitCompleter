import temboo = module("./temboo");
import express = module("express");

var Google = require("temboo/Library/Google/DistanceMatrix");

export function initGoogleWalkingDistance(app) {
  app.get("/google-walking-distance", function(request, response) {
    var walkingDistanceMatrixChoreo = new Google.WalkingDistanceMatrix(temboo.session);

    var walkingDistanceMatrixInputs = walkingDistanceMatrixChoreo.newInputSet();
    console.log(request.query);
    walkingDistanceMatrixInputs.set_Destinations(request.query.queries);
    walkingDistanceMatrixInputs.set_Origins(request.query.origins);

    walkingDistanceMatrixChoreo.execute(
      walkingDistanceMatrixInputs,
      results => {
        console.log(results.get_Response());
        response.send({success: true, results: results.get_Response()});
      },
      error => response.send({ success: false, error: error })
    );
  });
}

