### St. Paul Crime Incident Web Application

Vue.js Single Page Application About Crimes in St. Paul with RESTful API Integration

The application uses Vue.js to display information about St. Paul Crimes with an Interactive Map (Created with [Leaflet API](https://leafletjs.com/) & [Nominatim API](https://nominatim.org/release-docs/develop/api/Overview/)) and supports filtering of the crime results retrieved from the RESTful API.

Some of these filters include "incident type", "neighborhood name", "start-time","end-time", & "date-range". Users can also submit new incident with our "New Incident Form" page which updates the SQLite3 database upon submission.

The back-end is built with Express.js, Node.js, and the SQLite3 database. Information on crime incidents from the St. Paul public dataset can be access through the RESTful API endpoints with server requests & specific query parameters.

Short demo video for this St. Paul Crime Incident Web Application: www.youtube.com/watch?v=ZgktA1Wn71E


The implementation of the front-end side of application can be found on this Github repository: [wd-stpaulcrime-vue](https://github.com/kevinrsun/wd-stpaulcrime-vue)
