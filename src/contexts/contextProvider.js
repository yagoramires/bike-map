/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from 'react';

import geoService from '../api/geoService';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [inputValue, setInputValue] = useState();

  const [initialLat, setInitialLat] = useState(-23.000372);
  const [initialLong, setInitialLong] = useState(-43.365894);
  const [countryData, setCountryData] = useState([]);
  const [selectValues, setSelectValues] = useState([]);

  const [countryNetworks, setCountryNetworks] = useState([]);
  const [countryStations, setCountryStations] = useState([]);
  const [allNetworks, setAllNetworks] = useState([]);
  const [allStations, setAllstations] = useState([]);
  const [networksCountryLength, setNetworksCountryLength] = useState(0);

  const [done, setDone] = useState(false);

  const getSelectValues = async () => {
    const {
      data: { networks },
    } = await geoService.getNetworks();

    let allCountries = [];
    networks.forEach((network) => allCountries.push(network.location.country));

    const countriesFilter = new Set(allCountries);
    const contriesArray = [...countriesFilter];
    contriesArray.sort();
    setSelectValues(contriesArray.sort());
    setInputValue('BR');
    // pega todos os paises e coloca dentro de um array para ser usado no select
  };

  const getNetworksCountry = async () => {
    setDone(false);
    setCountryData([]);
    setCountryNetworks([]);
    setCountryStations([]);
    setAllNetworks([]);
    setAllstations([]);
    setNetworksCountryLength(0);

    //reseta todas as variáveis

    const {
      data: { networks },
    } = await geoService.getNetworks();

    //console.log(networks); //retorna todos os networks

    const getCountry = networks.filter(
      (network) => network.location.country === inputValue
    );

    //console.log(getCountry); //filtra por país baseado no input

    setInitialLat(getCountry[0].location.latitude);
    setInitialLong(getCountry[0].location.longitude);

    // define a lat e long iniciais

    setCountryData(getCountry);

    // chama a função que pega os dados por objeto
  };

  useEffect(() => {
    if (inputValue) {
      getNetworksCountry();
    }
  }, [inputValue]);

  // chama a função ao alterar o inputValue (PAÍS)

  const handleCountryData = (data) => {
    const hrefs = data.map((network) => network.href);

    //pega todos os hrefs

    hrefs.forEach((href) => {
      getStationsCountry(href);
    });

    // passa por todos hrefs e chama a funcao
  };

  useEffect(() => {
    handleCountryData(countryData);
  }, [countryData]);

  // chama a função ao alterar o countryData (alterado pela primeira função)

  const getStationsCountry = async (href) => {
    const {
      data: { network },
    } = await geoService.getStations(href);

    //console.log(network); //entra em cada href e retorna um objeto com as stations e locations

    // if (network.stations.length !== 0) {
    //   setNetworksCountryLength(networksCountryLength + 1);
    // }

    if (
      network.stations.length !== 0 &&
      network.stations.length !== undefined
    ) {
      const countryNetworks = {
        id: network.id,
        stationsLen: network.stations.length,
      };
      setCountryNetworks(countryNetworks);
      // console.log(countryNetworks);
    }
    // se o objeto tiver pelo menos 1 station, chama atualiza o countryNetworks (passado no componente info, trazendo o nome e o tamanho de )

    const locationStations = network.stations.map((stationData) => {
      return {
        'type': 'Feature',
        'properties': {
          'description': `<p>${stationData.name}</p> <p>Empty Slots: ${stationData.empty_slots}</p> <p>Free Bikes: ${stationData.free_bikes}</p>`,
          'icon': 'bicycle',
        },
        'geometry': {
          'type': 'Point',
          'coordinates': [stationData.longitude, stationData.latitude],
        },
      };
    });
    //retorna um array com objetos contendo as informações de cada estação, um objeto no formato utilizado para ser exibido no mapa

    setCountryStations(locationStations);
    //atualiza o country stations com os dados

    setTimeout(() => {
      setDone(true);
    }, 1500);
    //atualiza os valores no mapa
  };

  useEffect(() => {
    if (countryStations.length !== 0) {
      const allStationsArray = allStations.concat(countryStations);
      setAllstations(allStationsArray);
    }
  }, [countryStations]);
  // quando altera o countryStations, concatena o valor aterior com o objeto passado (de cada href retorna um objeto)

  useEffect(() => {
    const allNetworksArray = allNetworks.concat(countryNetworks);

    setAllNetworks(allNetworksArray);
  }, [countryNetworks]);
  // quando altera o countryStations, concatena o valor aterior com o objeto passado (de cada href retorna um objeto) (usado no component info)

  useEffect(() => {
    setNetworksCountryLength(allNetworks.length);
  }, [done]);
  // quando acabar, conta o total de objetos no array para imprimir na tela

  useEffect(() => {
    getSelectValues();
  }, []);
  // ao montar o app ele pega os valores do select

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
        selectValues,
        done,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
