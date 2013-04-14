  function initGmap(lat, lng){
    var mapOptions ={
      center: new google.maps.LatLng(lat, lng),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);

    console.log(map);
  }