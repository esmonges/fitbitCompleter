var g = {};

  window.onload = function() {
    openLoadingPopup();

    //assume that if one is not present, the oauth token has not been used
    if(!localStorage["fitbitCompleter" + "AccessToken"]
      ||!localStorage["fitbitCompleter" + "AccessTokenSecret"]
      ||!localStorage["fitbitCompleter" + "UserID"]){
      $.ajax({
        type: "get",
        url: "finalize-fitbit-oauth",
        data: {
          oauthTokenSecret: localStorage["fitbitCompleter" + "oauthTokenSecret"],
          callbackId: localStorage["fitbitCompleter" + "callbackId"]
        },
        success: function(response) {
          if (response.success) {
            localStorage["fitbitCompleter" + "AccessToken"] = response.accessToken;
            localStorage["fitbitCompleter" + "AccessTokenSecret"] = response.accessTokenSecret;
            localStorage["fitbitCompleter" + "UserID"] = response.userId;
          } else {
            console.log(response.error);
          }

          if (!checkLogin()) { // In initializationCode.js
            return;
          };
          makeLogoutTappable(); // In initializationCode.js
          getFitbitData();
        }
      });
    } else{
        if (!checkLogin()) { // In initializationCode.js
          return;
        };
        makeLogoutTappable(); // In initializationCode.js
        getFitbitData();
    }

    function getFitbitData() {
      $.ajax({
        type: "get",
        url: "get-fitbit-data",
        data: {
          accessToken: localStorage["fitbitCompleter" + "AccessToken"],
          accessTokenSecret: localStorage["fitbitCompleter" + "AccessTokenSecret"]
        },
        success: function(response) {
          if (response.success) {
            g.caloriesGoal = response.caloriesGoal;
            g.actualCalories = response.actualCalories;
            g.goalSteps = response.goalSteps;
            g.actualSteps = response.actualSteps;
          } else {
            g.caloriesGoal = 2000;
            g.actualCalories = 200;
            g.goalSteps = 5000;
            g.actualSteps = 500;
          }

          displayUserData();
          closeLoadingPopup();
        }
      });
    }

    function displayUserData(){
      var steps = $("#remainingSteps");
      var calories = $("#remainingCalories");
      steps.html("");
      calories.html("");

      if (!g.goalSteps || (g.goalSteps - g.actualSteps) < 0) {
        steps.html("You've completed your steps goal for the day, but tap here for more suggestions on places to walk to.");
      } else {
        steps.html("You have " + (g.goalSteps - g.actualSteps) + " steps remaining to reach your goal today. Tap here to find places to walk to complete this goal!");
      }

      if (!g.caloriesGoal || (g.caloriesGoal - g.actualCalories) < 0) {
        calories.html("You've achieved your calorie goal for the day, but tap here for more suggestions on foods to eat.");
      } else {
        calories.html("You are " + (g.caloriesGoal - g.actualCalories) + " calories below your goal for today. Tap here for suggestions on how to complete your goal.");
      }

  }
}
  function dummyData(){
    console.log("here");
    g.goalSteps = 2000;
    g.actualSteps = 500;
    g.caloriesGoal = 2000;
    g.actualCalories = 1000;
    displayUserData();
  }