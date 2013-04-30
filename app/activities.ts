// Adapted from http://typescript.codeplex.com/SourceControl/changeset/view/ac38ce9e29b3aeaa1beaebdae6729d0bc83ad231#samples/imageboard/db.ts

import mongodb = module("mongodb");

var server = new mongodb.Server("localhost", 27017, { auto_reconnect: true }, {})
export var db = new mongodb.Db("db", server);
db.open(() => {});

export interface Activity {
  _id: string;
  name: string;
  calories: number;
  id: number;
}

export function getActivities(callback: (activities: Activity[]) => void) {
  db.collection("activities", (error, activities_collection) => {
    if (error) {
      throw error;
    }

    activities_collection.find({}).toArray((error, activity_objects) => {
      if (error) {
        throw error;
      }
      callback(activity_objects);
    });
  });
}

