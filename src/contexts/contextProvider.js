/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from 'react';

import geoService from '../api/geoService';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [inputValue, setInputValue] = useState('BR');

  const [initialLat, setInitialLat] = useState(-22.91226530375198);
  const [initialLong, setInitialLong] = useState(-43.23066241220844);
  const [countryData, setCountryData] = useState([]);

  const [countryNetworks, setCountryNetworks] = useState([]);
  const [countryStations, setCountryStations] = useState([]);
  const [allNetworks, setAllNetworks] = useState([]);
  const [allStations, setAllstations] = useState([]);
  const [networksCountryLength, setNetworksCountryLength] = useState(0);

  const getNetworksCountry = async () => {
    setAllNetworks([]);
    setAllstations([]);
    const {
      data: { networks },
    } = await geoService.getNetworks();

    const getCountry = networks.filter(
      (network) => network.location.country === inputValue
    );

    setInitialLat(getCountry[0].location.latitude);
    setInitialLong(getCountry[0].location.longitude);

    setCountryData(getCountry);
  };

  useEffect(() => {
    if (inputValue) {
      getNetworksCountry();
    }
  }, [inputValue]);

  const handleCountryData = (data) => {
    const hrefs = data.map((network) => network.href);
    setNetworksCountryLength(hrefs.length);

    hrefs.forEach((href) => {
      getStationsCountry(href);
    });
  };

  useEffect(() => {
    handleCountryData(countryData);
  }, [countryData]);

  const getStationsCountry = async (href) => {
    const {
      data: { network },
    } = await geoService.getStations(href);

    const countryNetworks = {
      id: network.id,
      stationsLen: network.stations.length,
    };
    setCountryNetworks(countryNetworks);

    const locationStations = network.stations.map((location) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
      };
    });

    setCountryStations(locationStations);
  };

  useEffect(() => {
    const allStationsArray = allStations.concat(countryStations);
    const allNetworksArray = allNetworks.concat(countryNetworks);

    setAllNetworks(allNetworksArray);
    setAllstations(allStationsArray);
  }, [countryStations]);

  return (
    <StateContext.Provider
      value={{
        inputValue,
        setInputValue,
        initialLat,
        initialLong,
        allStations,
        networksCountryLength,
        allNetworks,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
