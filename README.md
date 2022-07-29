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

<h1> Testing this app </h1>

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

<h1> Author </h1>

<div align="center" style="display: flex;align-items: center;justify-content: center; gap: 1rem;">
    <img style="border-radius: 50%;" src="https://i.imgur.com/mDJjScy.jpg" width="150px;" />
    <div style="display: flex;align-items: center;justify-content: center; gap: 1rem; flex-direction: column">
        <a
            href="https://www.linkedin.com/in/yagoramires/"
            target="_blank"
            ><img
            src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"
            target="_blank"
        />
        <a href="https://github.com/yagoramires" ><b>Yago Ramires</b> 🚀</a>
        </a>
    </div>
</div>
