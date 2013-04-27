///<reference path='..\node\node.d.ts' />

import temboo = module("./temboo");
import express = module("express");

var foursquare = require("../node_modules/temboo/Library/Foursquare/Venues");

export function init(server) {
  server.get("/foursquare-venues", (request, response) => {
    var searchVenuesChoreo = new foursquare.SearchVenues(temboo.session);

    var searchVenuesInputs = searchVenuesChoreo.newInputSet();

    var data = request.query;
    var query = data.query;
    var latitude = data.latitude;
    var longitude = data.longitude;

    // Set credential to use for execution
    searchVenuesInputs.set_ClientID("2UBT5JSQ53KR4BPB3KXZCIK2OSTXRQNA2N2SQC322LGVKDNA");
    searchVenuesInputs.set_ClientSecret("WT4CXWCEERR04PQD45M4H3XQVO5C3YSOMH2UOK3DXRJYUULV");
    // Set inputs
    searchVenuesInputs.set_Query(query);
    searchVenuesInputs.set_Latitude(latitude);
    searchVenuesInputs.set_Longitude(longitude);

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

  server.get("/foursquare-explore", (request, response) =>{
    var exploreChoreo = new foursquare.Explore(temboo.session);

    var data = request.query;
    var latitude = data.latitude;
    var longitude = data.longitude;

    // Instantiate and populate the input set for the choreo
    var exploreInputs = exploreChoreo.newInputSet();

    // Set inputs
    exploreInputs.set_ClientID("2UBT5JSQ53KR4BPB3KXZCIK2OSTXRQNA2N2SQC322LGVKDNA");
    exploreInputs.set_ClientSecret("WT4CXWCEERR04PQD45M4H3XQVO5C3YSOMH2UOK3DXRJYUULV");
    exploreInputs.set_Latitude(latitude);
    exploreInputs.set_Longitude(longitude);

    // Run the choreo, specifying success and error callback handlers
    exploreChoreo.execute(
      exploreInputs,
      function(results){
        console.log(results);
        response.send({ success: true, results: results.get_Response() });
      },
      function(error){

        console.log(error.type); console.log(error.message);
      }
    );
  });
}

