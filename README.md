fitbitCompleter
===============

Omer Zach and Edward Smongeski
------------------------------
ozach, esmonges
------------------------------

Our term project for 15237 is an app called fitbitCompleter. This app makes use of the health and
wellbeing devices provided by fitbit, along with the APIs provided by fitbit, to take a user's fitbit
information, and reccomend to them ways to complete their fitness goals.

To run this app, we needed to host on a non-local server. You may be able to run the app locally using
nodejs, but we recommend running the app from our server using the following directions.

1. SSH to 198.199.68.36
   username: root
   password: pxwprucatjbt
2. run "./mongodb/bin/mongod --dbpath data/db" in one terminal (or backgrounded)
3. run "nodejs app/app.js"
4. navigate to fitbitcompleter.omerzach.com:3000

In the event that the server is already running, (usually indicated by an error from node), feel free
to "killall -9 mongod" and "killall -9 nodejs" and restart the server, or just navigate to the page.

If you have any trouble with the server, and if you need someone with a foursquare account to log in
and let you play with the app, just let us know.