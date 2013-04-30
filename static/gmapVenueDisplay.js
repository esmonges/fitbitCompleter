/* TODO:
 * dynamic determination of zoom based on marker location
 * create links to directions (probably in fsvenues js code)
 */

function initGmap(lat, lng) {
  var mapDiv = $("#map-canvas-hidden");
  mapDiv.attr("id", "map-canvas")
  mapDiv.removeClass("hiddenMap");
  mapDiv.addClass("visibleMap");

  var mapOptions = {
    center: new google.maps.LatLng(lat, lng),
    zoom: 14,
    draggable: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  g.map = new google.maps.Map(
    document.getElementById("map-canvas"),
    mapOptions
  );

  g.centerMarker = new google.maps.Marker({
    position: g.map.getCenter(),
    map: g.map,
    title: "You are here"
  });

  console.log(g.map);
}

function markerHandler(event) {
  var visibles = $("li > a");
  var spans = $("li > span");
  spans.removeClass("hidden");
  spans.addClass("visible");

  visibles.removeClass("visible");
  visibles.addClass("hidden");

  var jqtarget = $(event.target);

  var i = jqtarget.attr("num");
console.log(i);
console.log(jqtarget);

  var link = jqtarget.children();

  if(link.length != 2){
    link = jqtarget.parent().children();
  }
  //target.textContent = "";

  $(link[0]).removeClass("visible");
  $(link[0]).addClass("hidden");
  $(link[1]).removeClass("hidden");
  $(link[1]).addClass("visible");


  var lat = g.displayedVenues[i].venue.location.lat;
  var lng = g.displayedVenues[i].venue.location.lng;
  putMarker(lat, lng);
}

function putMarker(lat, lng) {
  if (g.destMarker) {
    g.destMarker.setMap(null);
  }

  g.destMarker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    map: g.map,
    title: "Destiniation"
  });
}

function generateDirectionsFromFSV(FSvenue) {
  var saddr = "";
  var daddr = "";

  saddr = g.lat + "," + g.lon;
  daddr = FSvenue.location.lat + "," + FSvenue.location.lng;

  return "https://maps.google.com/maps?saddr=" + saddr
         + "&daddr=" + daddr
         + "&dirflg=w";
}

