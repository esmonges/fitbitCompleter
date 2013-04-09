///<reference path='..\node\node.d.ts' />

import temboo = module("./temboo");
import express = module("express");

var foursquare = require("../node_modules/temboo/Library/Foursquare/Venues");

export function initFoursquare(app) {
  app.use(express.bodyParser());
  app.get("/foursquare-venues/:latitude,:longitude,:query", (request, response) => {
    var searchVenuesChoreo = new foursquare.SearchVenues(temboo.session);

    var searchVenuesInputs = searchVenuesChoreo.newInputSet();

    console.log("request: " + request);
    var data = request.body;
    console.log("query: " + request.params.query);
    console.log("lat: " + request.params.latitude);
    console.log("long: " + request.params.longitude);

    // Set credential to use for execution
    searchVenuesInputs.set_ClientID("2UBT5JSQ53KR4BPB3KXZCIK2OSTXRQNA2N2SQC322LGVKDNA");
    searchVenuesInputs.set_ClientSecret("WT4CXWCEERR04PQD45M4H3XQVO5C3YSOMH2UOK3DXRJYUULV");
    // Set inputs
    searchVenuesInputs.set_Query("asian food"/*request.params.query*/);
    searchVenuesInputs.set_Latitude(request.params.latitude);
    searchVenuesInputs.set_Longitude(request.params.longitude);

    // Execute and send response
    searchVenuesChoreo.execute(
      searchVenuesInputs,
      results => {
        console.log("Results: " + results);
        response.send({ success: true, results: results.get_Response() });
      },
      error => {
        console.log("Error type: " + error.type);
        console.log("Error messageype: " + error.message);
        response.send({ success: false, error: error });
      }
    );
  });
}

