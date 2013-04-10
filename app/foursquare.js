var temboo = require("./temboo")

var foursquare = require("../node_modules/temboo/Library/Foursquare/Venues");
function initFoursquare(app) {
    app.get("/foursquare-venues", function (request, response) {
        var searchVenuesChoreo = new foursquare.SearchVenues(temboo.session);
        var searchVenuesInputs = searchVenuesChoreo.newInputSet();
        var data = request.query;
        var query = data.query;
        var latitude = data.latitude;
        var longitude = data.longitude;
        searchVenuesInputs.set_ClientID("2UBT5JSQ53KR4BPB3KXZCIK2OSTXRQNA2N2SQC322LGVKDNA");
        searchVenuesInputs.set_ClientSecret("WT4CXWCEERR04PQD45M4H3XQVO5C3YSOMH2UOK3DXRJYUULV");
        searchVenuesInputs.set_Query(query);
        searchVenuesInputs.set_Latitude(latitude);
        searchVenuesInputs.set_Longitude(longitude);
        searchVenuesChoreo.execute(searchVenuesInputs, function (results) {
            console.log("Results: " + results);
            response.send({
                success: true,
                results: results.get_Response()
            });
        }, function (error) {
            console.log("Error type: " + error.type);
            console.log("Error messageype: " + error.message);
            response.send({
                success: false,
                error: error
            });
        });
    });
}
exports.initFoursquare = initFoursquare;
