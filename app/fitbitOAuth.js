var temboo = require("./temboo")

var fitbitOAuth = require("../node_modules/temboo/Library/Fitbit/OAuth");
function init(server) {
    server.get("/init-fitbit-oauth", function (request, response) {
        var initializeOAuthChoreo = new fitbitOAuth.InitializeOAuth(temboo.session);
        var initializeOAuthInputs = initializeOAuthChoreo.newInputSet();
        initializeOAuthInputs.set_AccountName("omer");
        initializeOAuthInputs.set_AppKeyName("FitbitCompleter");
        initializeOAuthInputs.set_AppKeyValue("61191725-521b-4900-a");
        initializeOAuthInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
        initializeOAuthInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");
        initializeOAuthInputs.set_ForwardingURL("http://fitbitcompleter.omerzach.com:3000/signedin.html");
        var success = function (results) {
            response.send({
                url: results.get_AuthorizationURL(),
                oauthTokenSecret: results.get_OAuthTokenSecret(),
                callbackId: results.get_CallbackID(),
                success: true
            });
        };
        initializeOAuthChoreo.execute(initializeOAuthInputs, success, function (error) {
            return response.send({
                error: error,
                success: false
            });
        });
    });
    server.get("/finalize-fitbit-oauth", function (request, response) {
        var oauthTokenSecret = request.query["oauthTokenSecret"];
        var callbackId = request.query["callbackId"];
        var finalizeOAuthChoreo = new fitbitOAuth.FinalizeOAuth(temboo.session);
        var finalizeOAuthInputs = finalizeOAuthChoreo.newInputSet();
        finalizeOAuthInputs.set_AccountName("omer");
        finalizeOAuthInputs.set_AppKeyName("FitbitCompleter");
        finalizeOAuthInputs.set_AppKeyValue("61191725-521b-4900-a");
        finalizeOAuthInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
        finalizeOAuthInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");
        finalizeOAuthInputs.set_OAuthTokenSecret(oauthTokenSecret);
        finalizeOAuthInputs.set_CallbackID(callbackId);
        finalizeOAuthChoreo.execute(finalizeOAuthInputs, function (results) {
            response.send({
                success: true,
                accessToken: results.get_AccessToken(),
                accessTokenSecret: results.get_AccessTokenSecret(),
                userId: results.get_UserID()
            });
        }, function (error) {
            return response.send({
                success: false,
                error: error
            });
        });
    });
}
exports.init = init;
