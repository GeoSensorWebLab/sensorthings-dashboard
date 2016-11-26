# Change Log

A list of changes and fixes for each release.

## v0.8.0 (2016-11-25)

### FEATURES

* Add case-sensitive search filter for Things
* Validate GeoJSON for Locations and prevent bad GeoJSON from causing errors with LeafletJS
* Display a warning if Location cannot be used for some reason
* Add button to show a text box to paste a Thing's link to quickly switch the current Thing. It only reads the id number and will ignore another server's host/port/path!
* Add button for downloading all loaded Observations in a Datastream to a CSV file
* Add build script to compile to public directory (displays build file sizes)
* Zoom map around results after loading
* Use colour and size to show active marker

### FIXES

* Fix UglifyJS to work with ES Harmony source code
* Change "LOGO" to "Dashboard" in title bar
* Remove c3 and d3 libraries as they are not used
* Decrease styling prominence for the Datastream "Details" toggle
* Remove tiny-lr as it is not being used

### UPDATES

* Upgrade pluralize to 3.0.0
* Upgrade leaflet to 1.0.2
* Upgrade JQuery to 3.1.1
* Upgrade Bootstrap to v4.alpha-5
* Upgrade Highcharts to 5.0.4
* Upgrade broccoli-concat 3.0.5
* Upgrade broccoli-slow-trees to 3.0.1

## v0.7.0 (2016-10-19)

* Include fix from Eclise Whiskers that caused query options in AJAX requests to be recursively repeated
* Implement a chart wrapper class to make swapping chart libraries a bit easier
* Switch to using Highcharts Stock Chart for displaying time series data, as further development with C3.js will require me to do chart and aggregation coding when development is needed elsewhere
* Switch to use of the web build of Eclipse Whiskers, thus removing a duplication of JQuery and Q Promise libraries
* Filter non-numeric values from datastream observations statistics table, which was causing NULL values in calculations
* Add HTML links to go directly to the entities in the browser
* Add convenient time range buttons for common time ranges
* Display the datastream units in the summary table
* Add NPM shrinkwrap file as a lockfile is useful for providing a repeatable dependency environment for the Node application

## v0.6.0 (2016-05-20)

* Update documentation for project now that it is public
* Document production deployment options
* Remove built-in SensorThings JS module and replace with Eclipse Whiskers client library
* Fix ES6 polyfill via Babel

## v0.5.0 (2016-05-13)

* Add Changelog, Contributor Guide, Code of Conduct
* Converted Notifier from function to class
* Fix styling class for Bootstrap 4 danger alert boxes
* Add date validation warnings for Time Range Picker
* Display a message if a datastream has no observations in the time range
* Replace nvd3.js charts with c3.js charts to fix y-axis label fit
* Fix padding and display of sensors list on mobile devices
* Resized sidebar for mobile devices
* Fix map resize when window size changes causing the map to break while the map is not visible
* Break up view classes into more methods
* Add require statements for SensorThings library
* Add noscript notice to pages for browsers with JavaScript disabled

## v0.4.0 (2016-05-10)

* Add count of loaded Observations in each Datastream
* Move inline scripts to scripts directory
* Move globals into App namespace
* Add class for simplifying map initializations
* Update UI for Time Range Picker
* Add DateTimePicker library (MomentJS fork) for clients that do not have a native datetime picker
* Load Observations from default Time Picker Range on page load
* Load Observations from active Time Picker Range when range changes
* Add function to load *all* Observations in a Datastream
* Add functionality to statistics table

## v0.3.0 (2016-05-06)

* Remove ES6 code from inline script tags
* Extract HTML to templates
* Load charts with opacity transition
* Load Datastreams from SensorThings
* Load Observations from SensorThings
* Add units to charts
* Render non-numeric data with an alternative to a chart

## v0.2.0 (2016-05-05)

* Extract functions to separate files
* Store custom SensorThings URL in Local Storage
* Automatically load or store SensorThings URL in the page's query parameters
* Load Things and Locations from SensorThings
* Draw Locations on Map page
* Add default SensorThings URL
* Add marker popups
* Use a base class for SensorThings models
* Load Thing metadata on Thing page

## v0.1.1 (2016-05-05)

* Make navbar full-width (removes rounded corners)
* Add mockup Settings page
* Refactor library loading in Brocfile.js
* Fix anchor offset for pulsing marker

## v0.1.0 (2016-05-04)

* Switch to Bootstrap v4 Alpha
* Add mockup Map page
* Hide map zoom controls on mobile devices
* Add map screen toggle for mobile devices
* Add mockup Thing page
* Add dummy NVD3 charts
* Add colour hash function for datastreams to always have the same colour instead of random
* Add index page

## v0.0.0 (2016-05-03)

* Import app from Broccoli Application template
