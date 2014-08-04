Digi Foosball
=============

A web application that communicates with Digi Device Cloud to retrieve
information from a device rigged up to a foosball table. Tracks stats and
scores for foosball games.

Usage Notes
-----------

Create a file named `app.yml` in the `config/` directory containing the
following information:

```
device_cloud:
    username:
    password:
    device_id:
    home_input:
    away_input:
```

Technologies
------------

The Ruby-based Sinatra micro web framework is used as a server-side back-end, 
which interfaces with an SQLite3 database and provides an API through which the
 AngularJS based front-end can retrieve data. A Device Cloud Monitor is used to
 send information to the application via HTTP requests, and Web Sockets are 
used to pipe live updates from the server-side to the client-side.

Hardware
--------

An XBee device on an XBee Dev Board is used to interface with Device Cloud.
Infared transmitters and receivers are used to automatically track goals.

Credits
-------

Created by the Summer 2014 Digi Student Engineers team:

* Bryce Kalow
* Christine Karas
* Jacob Drost
* Ryan Shellberg
