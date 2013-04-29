function makeLogoutTappable(){
  $("#logout").onButtonTap(popupLogout, function(){});
}

function popupLogout(){
  var source = $("#logout-template").html();
  var template = Handlebars.compile(source);
  var data = {};
  $("body").append(template(data));
  $("#close-overlay").onButtonTap(
    closeLogoutPopup,
    function() {}
  );
}

function logout(){
  console.log("logout");
}

function closeLogoutPopup(){
  $("#overlay").remove();
}