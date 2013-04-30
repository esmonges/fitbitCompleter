import temboo = module("./temboo");
import express = module("express");

var fitbit = require("../node_modules/temboo/Library/Fitbit/Activities");
import activities = module("./activities");

// TODO: Consolidate with other identical functions!
var getCurrentFitbitDate = (): string => {
  var today = new Date();
  var day;
  if (today.getDate() < 10) {
    day = "0" + (today.getDate().toString());
  } else {
    day = today.getDate().toString();
  }

  var month;
  if ((today.getMonth() + 1) < 10) {
    month = "0" + (today.getMonth() + 1).toString();
  } else {
    month = (today.getMonth() + 1).toString();
  }

  var year = today.getFullYear().toString();
  return "" + year + "-" + month + "-" + day; // TODO
}

export function populate() {
  console.log("hi");
  var browseActivitiesChoreo = new fitbit.BrowseActivities(temboo.session);
  var browseActivitiesInputs = browseActivitiesChoreo.newInputSet();

  browseActivitiesInputs.set_AccessToken("a61692fc4676ef49a8014d7f93ae54ff");
  browseActivitiesInputs.set_AccessTokenSecret("67c0ea173a7eddf62cc621e107663ce5");
  browseActivitiesInputs.set_ConsumerKey("63678ae84a134e38ad62a70d473a7d57");
  browseActivitiesInputs.set_ConsumerSecret("f9f4cfc32cc14ad6bc97057d3000fab2");

  browseActivitiesChoreo.execute(
    browseActivitiesInputs,
    results => {
      var parsed = JSON.parse(results.get_Response());
      activities.db.collection("activities", (error, activitiesCollection) => {
        if (error) {
          console.log(error);
        }

        activitiesCollection.insert(parsed.categories[11].activities, (error, thing) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Success!");
            console.log(thing);
          }
        });
      });
    },
    error => {
      console.log("Failed to get activities from Fitbit");
    }
  );
}

