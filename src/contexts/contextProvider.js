import React, { createContext, useContext, useEffect, useState } from 'react';

import geoService from '../api/geoService';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [inputValue, setInputValue] = useState();
  const [initialLat, setInitialLat] = useState(-22.91226530375198);
  const [initialLong, setInitialLong] = useState(-43.23066241220844);

  const [stations, setStations] = useState();
  const [locations, setLocations] = useState();

  const getNetworks = async () => {
    const {
      data: { networks },
    } = await geoService.getNetworks();

    // const getCountry = networks.filter((network) =>
    //   console.log(network.location.country),
    // );

    const getLocation = networks.filter(
      (network) => network.location.city === inputValue,
    );

    setInitialLat(getLocation[0].location.latitude);
    setInitialLong(getLocation[0].location.longitude);

    const hrefs = getLocation.map((network) => network.href);

    setStations(hrefs);
  };

  const getStations = async () => {
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
      console.log(inputValue);
      getNetworks();
    }
  }, [inputValue]);

  useEffect(() => {
    if (stations) {
      // console.log(stations);
      getStations();
    }
  }, [stations]);

  useEffect(() => {
    if (locations) {
      // console.log(locations);
    }
  }, [locations]);

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
