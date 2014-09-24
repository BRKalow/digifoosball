[![Build Status](https://magnum.travis-ci.com/BRKalow/digifoosball.svg?token=5ZfUh24c3cN1xYonZ1Jm&branch=master)](https://magnum.travis-ci.com/BRKalow/digifoosball)

Digi Foosball
=============

A web application that communicates with Digi Device Cloud to retrieve
information from a device rigged up to a foosball table. Tracks stats and
scores for foosball games.

Browser Support
---------------

Currently this application has only been tested in the latest versions of
 Google Chrome and Safari. The application uses Server Sent Events, which are
 __not supported in current versions of Internet Explorer__. See [this chart](http://caniuse.com/#feat=eventsource) for current brower support of Server Sent Events.

Usage Notes
-----------

__To run locally__:

Create a file named `device_cloud.yml` in the `config/` directory containing
the following information:

```
username:
password:
device_id:
home_input:
away_input:
```

Then run the command `bundle install` and `rackup` in the root directory of the repository.

__To deploy to Heroku__:

Assuming you have intialized a Heroku app for the repository and added the remote
heroku address to the repository. You need to set the following Heroku config variables:

```
dc_username
dc_password
dc_device_id
dc_home_input
dc_away_input
```

See the [Heroku configuration page](https://devcenter.heroku.com/articles/config-vars)
for details on how to set this up. After you have set the configuration variables,
run `git push heroku master` and navigate to the application's Heroku address.

Technologies
------------

The Ruby-based Sinatra micro web framework is used as a server-side back-end, 
which interfaces with an SQLite3 database and provides an API through which the
 AngularJS based front-end can retrieve data. A Device Cloud Monitor is used to
 send information to the application via HTTP requests, and the EventSource
 protocol used to pipe live updates from the server-side to the client-side.

Hardware
--------

An Arduino with infrared LEDs and sensors is used to track goals, and an XBee
 device on an XBee Dev Board is used to send signals to an XBee Gateway,
 and through the Gateway to Device Cloud.

Credits
-------

Created by the Summer 2014 Digi Student Engineers team:

* Bryce Kalow
* Christine Karas
* Jacob Drost
* Ryan Shellberg
