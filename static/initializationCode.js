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
  window.localStorage.clear();
  closeLogoutPopup();
  window.location.href = "./signin.html";
}

function closeLogoutPopup(){
  $("#overlay").remove();
}

function openLoadingPopup(){
  var source = $("#loading-template").html();
  var template = Handlebars.compile(source);
  var data = {};
  $("body").append(template(data));
}

function closeLoadingPopup(){
  $("#loading").remove();
}

function checkLoginBeforeAjax(){
  if(!loggedInBeforeAjax()){
    window.location.href = "./signin.html";
  }
  else{
    //should be good...
  }
}

function loggedInBeforeAjax(){
  return ((localStorage["fitbitCompleter" + "oauthTokenSecret"] !== undefined)
        &&(localStorage["fitbitCompleter" + "callbackId"] !== undefined));
}

function checkLogin(){
  if(!loggedIn()){
    $("#load-error").html("Error, please log in to Fitbit");
    window.setTimeout(function(){
      window.location.href = "./signin.html";
    },2000);
    return false;
  }
  else{
    //good to go!
    return true;
  }
}

function loggedIn(){
  return ((localStorage["fitbitCompleter" + "AccessToken"] !== undefined)
        &&(localStorage["fitbitCompleter" + "AccessTokenSecret"] !== undefined));
}