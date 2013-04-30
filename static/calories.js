var g = {};

  var logFood = function() {
    var servings = $("#servings").val();
    var mealType = $("#meal").val();
    var foodId = $("#overlay").data("id");
    var unitId = $("#overlay").data("unit-id");

    if (servings > 0) {
      $("#servings").css("color", "black");
      $.ajax({
        type: "put",
        url: "log-fitbit-food",
        data: {
          accessToken: localStorage["fitbitCompleter" + "AccessToken"],
          accessTokenSecret: localStorage["fitbitCompleter" + "AccessTokenSecret"],
          foodId: foodId,
          amount: servings,
          mealType: mealType,
          unitId: unitId
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
      $("#servings").css("color", "red");
    }
  };

  var placeOverlay = function(name, id, calories_per_serving, servings_allowed, unitId) {
    return function() {
      var source = $("#suggestion-overlay-template").html();
      var template = Handlebars.compile(source);
      var data = {
        food_name: name,
        id: id,
        calories_per_serving: calories_per_serving,
        servings_allowed: servings_allowed,
        unitId: unitId
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
          console.log("ERROR");
          g.caloriesGoal = 2000;
          g.actualCalories = 200;
        }
        displayCalorieData();
        makeSuggestionsHighlightable();
        closeLoadingPopup();
        makeLogoutTappable(); // in initializationCode.js
      }
    });
  };

  function displayCalorieData() {
    g.remainingCalories = g.caloriesGoal - g.actualCalories;

    if (g.remainingCalories > 0) {
      var source = $("#summary-template").html();
      var template = Handlebars.compile(source);
      var data = {
        actualCalories: g.actualCalories,
        calorieGoal: g.caloriesGoal,
        remainingCalories: g.remainingCalories
      };

      $("#summary").html(template(data));
      $("#caloriesDesired").val(g.remainingCalories);
    } else {
      $("#summary").html("You've achieved your calorie goal for the day! Feel free to search for more food to eat, but remember that you might owe some exercise after!");
    }
  }

  function dummyCalorieData(){
    g.caloriesGoal = 2000;
    g.actualCalories = 500;
    displayCalorieData();
  }

  function searchFoods() {
    var foodQuery = $("#foodQuery");
    var searchQuery = foodQuery.val();
    var calQuery = $("#caloriesDesired");
    var nCals = calQuery.val();

    foodQuery.val("");

    if (isInt(nCals)) {
      g.targetCalories = nCals;
    } else {
      g.targetCalories = g.remainingCalories;
    }

    $.ajax({
      type: "get",
      url: "get-fitbit-foods",
      data: { query: searchQuery },
      success: function(response) {
        if (response.success) {
          g.foods = response.foods;
          displayFoodSuggestions();
          makeSuggestionsHighlightable();
        } else {
          console.log("Error");
        }
      }
    });
  }

  function displayFoodSuggestions() {
    var sortedFoods = g.foods.sort(function(a, b) {
      var adiff = Math.abs(a.calories - g.targetCalories);
      var bdiff = Math.abs(b.calories - g.targetCalories);
      return adiff - bdiff;
    });

    var i;
    var nEntries = Math.min(sortedFoods.length, 5);

    var source = $("#food-list-template").html();
    var template = Handlebars.compile(source);
    var data = { foods: sortedFoods.slice(0, nEntries) };

    $("#suggestions").html(template(data));
  }

  function makeSuggestionsHighlightable() {
    $.each($(".suggestion"), function (index, suggestion) {
      var servings = Math.floor(-g.remainingCalories / $(suggestion).data("calories"));
      var onTap = placeOverlay(
        $(suggestion).data("name"),
        $(suggestion).data("id"),
        $(suggestion).data("calories"),
        servings,
        $(suggestion).data("unit-id")
      );
      var onLong = function() { };
      ($(suggestion)).onButtonTap(onTap, onLong);
    });
  }

  function isInt(n) {
    return (n % 1) === 0;
  }
