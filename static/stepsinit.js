window.onload = function() {
    openLoadingPopup();
    if (!checkLogin()) {
      return;
    };

    $.ajax({
      type: "get",
      url: "get-fitbit-data",
      data: {
        accessToken: localStorage["fitbitCompleter" + "AccessToken"],
        accessTokenSecret: localStorage["fitbitCompleter" + "AccessTokenSecret"]
      },
      success: function(response) {
        if (response.success) {
          var goalSteps = response.goalSteps;
          var actualSteps = response.actualSteps;
          var stepsPerMile = response.stepsPerMile;

          localStorage.remainingSteps = goalSteps - actualSteps;
          localStorage.stepsPerMile = stepsPerMile;

          if (localStorage.remainingSteps > 0) {
            var source = $("#summary-template").html();
            var template = Handlebars.compile(source);
            var data = {
              actualSteps: actualSteps,
              remainingSteps: localStorage.remainingSteps,
              goalSteps: goalSteps
            };
            $("#summary").html(template(data));
            $("#stepsDesired").val(goalSteps);
         } else {
            $("#summary").html("You've achieved your step goal for the day! If you want to push yourself a little further, we'll suggest some more venues.");
          }

          closeLoadingPopup();
          makeLogoutTappable(); // in initializationCode.js
        }
      }
    });
  };