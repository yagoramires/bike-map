<h1 > Bikes Map </h1>

<p>In this code challenge i built an Web App which consults an API to retrieve a geolocated data to expose on a Map.</p>

<h2> Requirements: </h2>
<ul>
    <li> Build a Web App using <b><i>ReactJS</i></b></li>
    <li> Fetch your data from <a href="http://api.citybik.es/v2/networks">CityBikes</a>, an Api for Bike Sharing Data</li>
    <li> Show that data on a map, with 3 different layers: 
        <ol>
        <li>Number of networks, per country</li>
        <li>Number of stations, per network</li>
        <li>Station details</li>
        </ol></li>
    <li> Allow the user to drilldown, by clicking on markers</li>
    <li> Allow the user to go back to the previous layer</li>
</ul>

<p align="center">
<img src="./src/assets/readme.gif" title="App demo" alt='App demo' />
</p>

### Testing this app

```bash
    # Clone repository
    $ git clone https://github.com/yagoramires/bike-map.git
    # Access the repository folder
    $ cd bike-map
    # Install the dependencies
    $ yarn
    # Run the application in development mode
    $ yarn start
    # The server will start on port:3000 - access http://localhost:3000/
```
