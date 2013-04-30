var g = {
  KM_TO_MI: 0.621371,
  lat: 0,
  lon: 0,
  NSUGGESTIONS: 5,
  displayedVenues: []
};


function getGeoAndSubmit() {
  navigator.geolocation.getCurrentPosition(submitFSVSearch);
}

function submitFSVSearch(position) {
  var fsvQuery = $("#fsvQuery");
  var desiredSteps = $("#stepsDesired");
  var query = fsvQuery.val();
  var nSteps = desiredSteps.val();
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  g['lat'] = lat;
  g['lon'] = lon;

  if (query === "") {
    query = undefined;
  }
  else{
    //do nothing
  }

  fsvQuery.val("");

  if (isInt(nSteps)) {
    localStorage.targetSteps = nSteps;
  } else if (isInt(localStorage.remainingSteps)){
    localStorage.targetSteps = localStorage.remainingSteps;
  } else{
    localStorage.targetSteps = 1000;
  }


  desiredSteps.val("");

  if (query !== undefined){
    $.ajax({
      type:"get",
      data: {
        query: query,
        latitude: lat,
        longitude: lon
      },
      url:"/foursquare-venues",
      success: function(data) {
        var results = JSON.parse(data.results);
        var venues = results.response.venues;
        getWalkingDistances(venues);
        initGmap(lat, lon);
      }
    });
  } else {
    $.ajax({
      type: "get",
      data: {
        latitude: lat,
        longitude: lon
      },
      url: "foursquare-explore",
      success: function(data) {
        var results = JSON.parse(data.results);
        var venues = collateVenues(results.response.groups[0].items);
        getWalkingDistances(venues);
        initGmap(lat, lon);
      }
    });
  }
}

function collateVenues(items) {
  var length = items.length;
  var i;
  var venues = new Array(length);

  for (i=0; i < length; i++) {
    venues[i] = items[i].venue;
  }

  return venues;
}

function isInt(n){
  return ((n % 1) === 0 && n !== "");
}

function pairSortAndStore(venues, distObjs) {
  var targetDist;
  if (localStorage.targetSteps >= 0) {
    targetDist = (localStorage.targetSteps / localStorage.stepsPerMile) / 2;
  } else { //TODO: put in a requirement for steps if none exists
    targetDist = (2000 / localStorage.stepsPerMile) / 2;
  }

  var pairedList = [];
  var i;

  for (i = 0; i < venues.length; i++) {
    pairedList[i] = {};
    pairedList[i].venue = venues[i];
    pairedList[i].distanceInMiles = (distObjs[i].distance.value / 1000) * g.KM_TO_MI;
    pairedList[i].distanceInSteps = Math.round(pairedList[i].distanceInMiles * localStorage.stepsPerMile);
  }

  sortedPL = pairedList.sort(function(a, b) {
    var adiff = Math.abs(a.distanceInMiles - targetDist);
    var bdiff = Math.abs(b.distanceInMiles - targetDist);
    return adiff - bdiff;
  });

  g.sortedPL = sortedPL;
}

function getWalkingDistances(venues) {
  var queries = "";
  var origins;
  var i = 0;

  for (i = 0; i < venues.length; i++) {
    queries = queries + venues[i].location.lat + ","
              + venues[i].location.lng + "|";
  }

  queries = queries.substring(0, queries.length - 1);

  origins = g.lat + "," + g.lon;

  $.ajax({
    type: "get",
    data: {
      queries: queries,
      origins: origins,
      units: "imperial"
    },
    url:"/google-walking-distance",
    success: function(data) {
      var results = JSON.parse(data.results);
      var distObjs = results.rows[0].elements;
      pairSortAndStore(venues, distObjs);

      displaySuggestionsStartingAt(0);
      makeSuggestionsHighlightable();
    }
  });
}

function displaySuggestionsStartingAt(index) {
  var end = Math.min(index + g.NSUGGESTIONS, g.sortedPL.length);
  var i;
  var gdvIndex = 0;
  var resultsDiv = $("#suggestions");

  resultsDiv.html("");
  g.displayedVenues = [];

  for (i = index; i < end; i++) {
    g.displayedVenues[gdvIndex++] = g.sortedPL[i];
    displaySuggestion(g.sortedPL[i], i);
  }
}

function displaySuggestion(s, i) {
  var resultsDiv = $("#suggestions");
  var newLI = $("<li>");
  var newSpan = $("<span>");
  var dirLink = $("<a>");
  var link;

  newLI.attr("num", i);
  newLI.addClass("suggestion");

  link = generateDirectionsFromFSV(s.venue);
  dirLink.attr("href", link);
  dirLink.html(s.venue.name + ", Steps (Each Way): " + s.distanceInSteps + " Click again to get directions");
  dirLink.addClass("link");
  dirLink.addClass("hidden");

  newSpan.html(s.venue.name + ", Steps (Each Way): " + s.distanceInSteps);
  newSpan.attr("num", i);
  newLI.append(newSpan);
  newLI.append(dirLink);
  newLI.onButtonTap(markerHandler);
  resultsDiv.append(newLI);
}

function makeSuggestionsHighlightable() {
  $.each($(".suggestion"), function (index, suggestion) {
    var onTap = function() { };
    var onLong = function() { };
    ($(suggestion)).onButtonTap(onTap, onLong);
  });
}

