///<reference path='..\node\node.d.ts' />

import temboo = module("./temboo");

var foursquare = require("../node_modules/temboo/Library/Foursquare/Venues");

export function initFS(app) {
  app.get("/fs_venues", function(request, response) {
    var searchVenuesChoreo = new foursquare.SearchVenues(temboo.session);

    // Instantiate and populate the input set for the choreo
    var searchVenuesInputs = searchVenuesChoreo.newInputSet();

    // Set credential to use for execution
    searchVenuesInputs.set_ClientID("2UBT5JSQ53KR4BPB3KXZCIK2OSTXRQNA2N2SQC322LGVKDNA");
    searchVenuesInputs.set_ClientSecret("WT4CXWCEERR04PQD45M4H3XQVO5C3YSOMH2UOK3DXRJYUULV");
    // Set inputs
    searchVenuesInputs.set_Query("asian food");
    searchVenuesInputs.set_Latitude("44");
    searchVenuesInputs.set_Longitude("-79");

    var success = function(results) {
      console.log(results.get_Response());
    }

    // Run the choreo, specifying success and error callback handlers
    searchVenuesChoreo.execute(
      searchVenuesInputs,
      success,
      function(error) {
        console.log(error);
        console.log(error.message);
      }
    );
  });
}

