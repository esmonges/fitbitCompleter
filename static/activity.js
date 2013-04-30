var g = {};

  var isValidStartTime = function(startTime) {
    var chars = startTime.split("");
    var hours = startTime.substring(0, 2);
    var minutes = startTime.substring(3, 5);

    return (0 <= chars[0] && chars[0] <= 2)
        && (0 <= chars[1] && chars[1] <= 9)
        && (chars[2] === ":")
        && (0 <= chars[3] && chars[3] <= 5)
        && (0 <= chars[4] && chars[4] <= 9)
        && (0 <= hours && hours <= 23)
        && (0 <= minutes && minutes <= 59)
        && chars.length === 5;
  };

  var isValidDuration = function(duration) {
    return duration >= 0;
  }

  var logActivity = function() {
    var startTime = $("#start-time").val();
    var duration = $("#duration").val();
    var activityId = $("#overlay").data("id");

    if (isValidStartTime(startTime) && isValidDuration(duration)) {
      $("#start-time").css("color", "black");
      $("#duration").css("color", "black");

      $.ajax({
        type: "put",
        url: "log-fitbit-exercise",
        data: {
          accessToken: localStorage["fitbitCompleter" + "AccessToken"],
          accessTokenSecret: localStorage["fitbitCompleter" + "AccessTokenSecret"],
          startTime: startTime,
          duration: duration,
          activityId: activityId
        },
        success: function(response) {
          if (response.success) {
            console.log("Success!");
          } else {
            console.log("Failure: ");
            console.log(response.error);
          }
        }
      });
    } else {
      if (!isValidStartTime(startTime)) {
        $("#start-time").css("color", "red");
      } else {
        $("#start-time").css("color", "black");
      }

      if (!isValidDuration(duration)) {
        $("#duration").css("color", "red");
      } else {
        $("#duration").css("color", "black");
      }
    }
  };

  var placeOverlay = function(name, id, calories_per_hour, time_needed) {
    return function() {
      var source = $("#suggestion-overlay-template").html();
      var template = Handlebars.compile(source);
      var now = new Date();
      var hours = now.getHours();
      var hoursString = (hours < 10) ? ("0" + hours) : ("" + hours);
      var minutes = now.getMinutes();
      var minutesString = (minutes < 10) ? ("0" + minutes) : ("" + minutes);
      var timeString = hoursString + ":" + minutesString;
      console.log(timeString);

      var data = {
        exercise_name: name,
        id: id,
        calories_per_hour: calories_per_hour,
        time_needed: time_needed,
        current_time: timeString
      };
      $("body").append(template(data));
      $("#close-overlay").onButtonTap(
        function() { $("#overlay").remove(); },
        function() {}
      );
    }
  }

  window.onload = function() {
    openLoadingPopup();
    if (!checkLogin()) {
      return;
    };

    $.ajax({
      type: "get",
      url: "get-fitbit-weight",
      data: {
        accessToken: localStorage["fitbitCompleter" + "AccessToken"],
        accessTokenSecret: localStorage["fitbitCompleter" + "AccessTokenSecret"]
      },
      success: function(response) {
        if (response.success) {
          localStorage["fitbitCompleter" + "weight"] = response.weight;
        } else {
          console.log("Error:")
          console.log(response.error);
        }

        makeLogoutTappable(); // in initializationCode.js

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
            } else {
              console.log("Error:")
              console.log(response.error);
              g.caloriesGoal = 2000;
              g.actualCalories = 200;
            }
            closeLoadingPopup();
            displayCalorieData();

            $.ajax({
              type: "get",
              url: "/get-fitbit-exercises",
              data: {
                accessToken: localStorage["fitbitCompleter" + "AccessToken"],
                accessTokenSecret: localStorage["fitbitCompleter" + "AccessTokenSecret"],
              },
              success: function(response) {
                if (response.success) {
                  g.exercises = response.exercises;
                  displayActivities();
                  makeSuggestionsHighlightable();
                } else {
                  console.log("Error:")
                  console.log(response.error);
                }
              }
            });
          }
        });
      }
    });
  };

  function displayCalorieData() {
    g.remainingCalories = g.caloriesGoal - g.actualCalories;

    if (g.remainingCalories < 0) {
      var source = $("#summary-template").html();
      var template = Handlebars.compile(source);
      var data = {
        actualCalories: g.actualCalories,
        caloriesGoal: g.caloriesGoal,
        remainingCalories: -g.remainingCalories
      };
      $("#summary").html(template(data));
    } else {
      $("#summary").html("You've achieved your calorie goal for the day! If you're still feeling up for more, try some of these exercises.");
    }
  }

  function displayActivities() {
    var activitySuggestions = $("#suggestions");
    var sortedActivities = g.exercises.sort(function(a, b) {
      var adiff = Math.abs((a.mets * 60) - (- g.remainingCalories));
      var bdiff = Math.abs((b.mets * 60) - (- g.remainingCalories));
      return adiff - bdiff;
    });

    var nEntries = Math.min(sortedActivities.length, 5);

    var source = $("#activity-list-template").html();
    var template = Handlebars.compile(source);

    var data = { activities: sortedActivities.slice(0, nEntries) }; 
    var weight = parseInt(localStorage["fitbitCompleter" + "weight"]);
    console.log(weight);
    if(!isInt(weight)){
      console.log("not weight");
      weight = 150;
    }
    a = weight
    for (var i = 0; i < data.activities.length; i++) {
      console.log("Mets : " + data.activities[i].mets);
      console.log("weight: " + weight);
      data.activities[i].calories = Math.round(data.activities[i].mets * weight);
    }
    $("#suggestions").html(template(data));
  }

  function makeSuggestionsHighlightable() {
    $.each($(".suggestion"), function (index, suggestion) {
      var time = Math.ceil(-g.remainingCalories * 60 / $(suggestion).data("calories"));
      var onTap = placeOverlay(
        $(suggestion).data("name"),
        $(suggestion).data("id"),
        $(suggestion).data("calories"),
        time
      );
      var onLong = function() { };
      ($(suggestion)).onButtonTap(onTap, onLong);
    });
  }

  function isInt(n){
    return (n%1 === 0) && (n !== "");
  }