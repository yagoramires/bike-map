/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from 'react';

import geoService from '../api/geoService';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [inputValue, setInputValue] = useState();
  const [initialLat, setInitialLat] = useState(-22.91226530375198);
  const [initialLong, setInitialLong] = useState(-43.23066241220844);

  const [stations, setStations] = useState();
  const [locations, setLocations] = useState([]);
  const [countryLocations, setCountryLocations] = useState([]);

  const getNetworksCountry = async () => {
    setLocations([]);
    const {
      data: { networks },
    } = await geoService.getNetworks();

    const getCountry = networks.filter(
      (network) => network.location.country === inputValue,
    );

    setInitialLat(getCountry[0].location.latitude);
    setInitialLong(getCountry[0].location.longitude);

    const hrefs = getCountry.map((network) => network.href);

    hrefs.forEach((href) => {
      getStationsCountry(href);
    });
  };

  const getStationsCountry = async (href) => {
    const {
      data: { network },
    } = await geoService.getStations(href);

    const locationStations = network.stations.map((location) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
      };
    });

    setCountryLocations(locationStations);
  };

  const getNetworksCity = async () => {
    const {
      data: { networks },
    } = await geoService.getNetworks();

    const getLocation = networks.filter(
      (network) => network.location.city === inputValue,
    );

    setInitialLat(getLocation[0].location.latitude);
    setInitialLong(getLocation[0].location.longitude);

    const hrefs = getLocation.map((network) => network.href);
    setStations(hrefs);
  };

  const getStationsCity = async () => {
    const {
      data: { network },
    } = await geoService.getStations(stations);

    const locationStations = network.stations.map((location) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
      };
    });

    setLocations(locationStations);
  };

  useEffect(() => {
    if (inputValue) {
      getNetworksCity();
      getNetworksCountry();
    }
  }, [inputValue]);

  useEffect(() => {
    if (stations) {
      // console.log(stations);
      getStationsCity();
      getStationsCountry();
    }
  }, [stations]);

  useEffect(() => {
    const allLocations = locations.concat(countryLocations);

    setLocations(allLocations);
    // console.log(allLocations);
  }, [countryLocations]);

  return (
    <StateContext.Provider
      value={{
        inputValue,
        setInputValue,
        initialLat,
        initialLong,
        locations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
