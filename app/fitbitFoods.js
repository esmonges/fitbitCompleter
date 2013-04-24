var temboo = require("./temboo")

var fitbit = require("../node_modules/temboo/Library/Fitbit");
var searchFoodsChoreo = new fitbit.SearchFoods(temboo.session);
function init(server) {
    server.get("/get-fitbit-foods", function (request, response) {
        var searchFoodsChoreo = new fitbit.SearchFoods(temboo.session);
        var searchFoodsInputs = searchFoodsChoreo.newInputSet();
        searchFoodsInputs.setCredential("FitbitCompleter");
        searchFoodsInputs.set_Format("json");
        searchFoodsInputs.set_Query(request.query.query);
        searchFoodsChoreo.execute(searchFoodsInputs, function (results) {
            var parsed = JSON.parse(results.get_Response());
            console.log("foods: " + parsed.foods);
            response.send({
                success: true,
                foods: parsed.foods
            });
        }, function (error) {
            console.log("Failed to get food from Fitbit");
            response.send({
                success: false,
                error: error
            });
        });
    });
}
exports.init = init;
