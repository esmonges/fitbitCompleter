  /* TODO: 
   * dynamic determination of zoom based on marker location
   * create links to directions (probably in fsvenues js code)
   */

  function initGmap(lat, lng){
    var mapDiv = $("#map-canvas");
    mapDiv.removeClass("hiddenMap");
    mapDiv.addClass("visibleMap");

    var mapOptions ={
      center: new google.maps.LatLng(lat, lng),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    g.map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);

    g.centerMarker = new google.maps.Marker({
      position: g.map.getCenter(),
      map: g.map,
      title: "You are here"
    });

    console.log(g.map);
  }

  function markerHandler(event){
    var visibles = $(".visible");
    visibles.removeClass("visible");
    visibles.addClass("hidden");

    var i = event.target.id;

    var link = $(event.target).children();

    link.removeClass("hidden");
    link.addClass("visible");

    var lat = g.displayedVenues[i].venue.location.lat;
    var lng = g.displayedVenues[i].venue.location.lng;
    putMarker(lat, lng);
  }

  function putMarker(lat, lng){

    if(g.destMarker){
      g.destMarker.setMap(null);
    }

    g.destMarker = new google.maps.Marker({
      position: new google.maps.LatLng(lat,lng),
      map: g.map,
      title: "Destiniation"
    });
  }

  function generateDirectionsFromFSV(FSvenue){
    var saddr = "";
    var daddr = "";

    saddr = g.lat + "," + g.lon;
    daddr = FSvenue.location.lat + "," + FSvenue.location.lng;

    return "https://maps.google.com/maps?saddr=" + saddr
           + "&daddr=" + daddr 
           + "&dirflg=w";
  }