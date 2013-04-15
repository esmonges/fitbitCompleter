var g = {KM_TO_MI: 0.621371,
           lat: 0, 
           lon: 0, 
           NSUGGESTIONS: 5,
           displayedVenues: []};


  function getGeoAndSubmit(){
    navigator.geolocation.getCurrentPosition(submitFSVSearch);
  }

  function submitFSVSearch(position){
    var fsvQuery = $("#fsvQuery");
    var query = fsvQuery.val();
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    g['lat'] = lat;
    g['lon'] = lon;

    fsvQuery.val("");

    $.ajax({
      type:"get",
      data: {query: query, 
        latitude: lat, 
        longitude: lon},
        url:"/foursquare-venues",
        success: function(data){
          var results = JSON.parse(data.results);
          var venues = results.response.venues;
          getWalkingDistances(venues);
          initGmap(lat, lon);}
        });
  }

  // function displayVenuesAndDistances(venues, distObjs){
  //   data.results = JSON.parse(data.results);
  //   var venues = data.results.response.venues;
  //   var MAXENTRIES = 5;
  //   var i;

  //   var nEntries = Math.min(venues.length, MAXENTRIES);

  //   var sortedVenues = venues.sort(function(a,b){
  //     return a.location.distance - b.location.distance;
  //   });

  //   g.sortedVenues = sortedVenues;

  //   getAndDisplayWalkingDistance(sortedVenues.slice(0,nEntries+1))
  // }

  function pairSortAndStore(venues, distObjs){

///////REMOVE THESE LINES////////
localStorage.stepsPerMile = 1;
localStorage.remainingSteps = 2000;
///////REMOVE THESE LINES////////

    var targetDist = (localStorage.remainingSteps/localStorage.stepsPerMile)/2;
    var pairedList = [];
    var i;


    for(i=0; i < venues.length; i++){
      pairedList[i] = {};
      pairedList[i].venue = venues[i];
      pairedList[i].distanceInMiles = distObjs[i].distance.value * g.KM_TO_MI;
      pairedList[i].distanceInSteps = Math.round(pairedList[i].distanceInMiles * localStorage.stepsPerMile);
    }

    sortedPL = pairedList.sort(function(a,b){
      var adiff = Math.abs(a.distanceInMiles - targetDist);
      var bdiff = Math.abs(b.distanceInMiles - targetDist);
      return adiff - bdiff;
    });

    g.sortedPL = sortedPL;
  }

  function getWalkingDistances(venues){
    var queries = "";
    var origins;
    var i = 0;

    for(i = 0; i < venues.length; i++){
      queries = queries + venues[i].location.lat + ","
      + venues[i].location.lng + "|";
    }

    queries = queries.substring(0, queries.length - 1);

    origins = g.lat + "," + g.lon;

    $.ajax({
      type:"get",
      data:{queries:queries, origins:origins, units:"imperial"},
      url:"/google-walking-distance",
      success: function(data){
        var results = JSON.parse(data.results);
        var distObjs = results.rows[0].elements;
        pairSortAndStore(venues, distObjs);

        displaySuggestionsStartingAt(0);
/*        var resultsDiv = $("#results");
        resultsDiv.html("");
        for(i = 0; i < venues.length; i++){
          var newDiv = $("<li>");
          newDiv.attr("id", i);
          newDiv.onButtonTap(markerHandler);
          newDiv.html(venues[i].name + ", Steps: " 
            + results.rows[0].elements[i].distance.text);
          resultsDiv.append(newDiv);
        } */
      }
    });
  }

  function displaySuggestionsStartingAt(index){
    var end = Math.min(index + g.NSUGGESTIONS, g.sortedPL.length);
    var i;
    var gdvIndex = 0;
    var resultsDiv = $("#results");

    resultsDiv.html("");
    g.displayedVenues = [];

    for(i = index; i < end; i++){
      g.displayedVenues[gdvIndex++] = g.sortedPL[i];
      displaySuggestion(g.sortedPL[i], i);
    }
  }

  function displaySuggestion(s, i){
    var resultsDiv = $("#results");
    var newDiv = $("<li>");

    newDiv.attr("id", i);
    newDiv.onButtonTap(markerHandler);

    newDiv.html(s.venue.name + ", Steps (Each Way): " 
      + s.distanceInSteps);
    resultsDiv.append(newDiv);

  }


// function getAndDisplayWalkingDistance(venues){
  //   var queries = "";
  //   var origins;
  //   var i = 0;

  //   g.displayedVenues = venues;
    
  //   for(i = 0; i < venues.length; i++){
  //     queries = queries + venues[i].location.lat + ","
  //     + venues[i].location.lng + "|";
  //   }

  //   queries = queries.substring(0, queries.length - 1);

  //   origins = g.lat + "," + g.lon;

  //   $.ajax({
  //     type:"get",
  //     data:{queries:queries, 
  //       origins:origins},
  //       url:"/google-walking-distance",
  //       success: function(data){
  //         var results = JSON.parse(data.results);
  //         var resultsDiv = $("#results");
  //         resultsDiv.html("");
  //         for(i = 0; i < venues.length; i++){
  //           var newDiv = $("<li>");

  //           newDiv.attr("id", i);
  //           newDiv.onButtonTap(markerHandler);

  //           newDiv.html(venues[i].name + ", Steps: " 
  //             + results.rows[0].elements[i].distance.text);
  //           resultsDiv.append(newDiv);
  //         }
  //       }
  //     });

  // }