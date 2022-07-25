/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
import { useStateContext } from '../../contexts/contextProvider';

export default function Map() {
  const { initialLat, initialLong, allStations } = useStateContext();

  const mapContainer = useRef(null);
  const map = useRef(null);
  const long = initialLong;
  const lat = initialLat;

  const [zoom] = useState(4);
  const [API_KEY] = useState('qNzilfZdZqz1XdoT2fWM');

  // useEffect(() => {
  //   // if (map.current) return; //stops map from intializing more than once
  //   map.current = new maplibregl.Map({
  //     container: mapContainer.current,
  //     style: `https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`,
  //     center: [long, lat],
  //     zoom: zoom,
  //   });

  //   map.current.on('load', function () {
  //     map.current.addSource('id', {
  //       type: 'geojson',
  //       data: {
  //         type: 'FeatureCollection',
  //         features: allStations,
  //       },
  //     });

  //     map.current.addLayer({
  //       id: 'bikePoints',
  //       type: 'circle',
  //       source: 'id',
  //       paint: {
  //         'circle-radius': 6,
  //         'circle-color': '#d10202',
  //       },
  //       filter: ['==', '$type', 'Point'],
  //     });
  //   });
  // }, [allStations]);

  useEffect(() => {
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`,
      center: [long, lat],
      zoom: zoom,
    });
    map.current.addControl(new maplibregl.NavigationControl(), 'top-left');

    map.current.on('load', function () {
      map.current.addSource('places', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          // 'features': [
          //   {
          //     'type': 'Feature',
          //     'properties': {
          //       'description':
          //         'texto',
          //       'icon': 'bicycle',
          //     },
          //     'geometry': {
          //       'type': 'Point',
          //       'coordinates': [long, lat],
          //     },
          //   },
            
          // ],
          'features' : allStations
        },
      });
      // Add a layer showing the places.

      map.current.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'places',
        'layout': {
          'icon-image': '{icon}_15',
          'icon-overlap': 'always',
        },
      });

      // When a click event occurs on a feature in the places layer, open a popup at the
      // location of the feature, with description HTML from its properties.
      map.current.on('click', 'places', function (e) {
        let coordinates = e.features[0].geometry.coordinates.slice();
        let description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maplibregl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map.current);
      });

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.current.on('mouseenter', 'places', function () {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      // Change it back to a pointer when it leaves.
      map.current.on('mouseleave', 'places', function () {
        map.current.getCanvas().style.cursor = '';
      });
    });
  }, [allStations]);

  return (
    <div className='map-wrap'>
      <div ref={mapContainer} className='map' />
    </div>
  );
}
