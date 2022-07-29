/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from 'react';

import geoService from '../api/geoService';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [apiNetworks, setApiNetworks] = useState([]);
  // Todos os networks recebidos da API
  const [selectValues, setSelectValues] = useState([]);
  // Valor filtrado da API para o select
  const [selectValue, setSelectValue] = useState();
  // Valor inserido pelo usuário

  const [initialLat, setInitialLat] = useState(-23.000372);
  const [initialLong, setInitialLong] = useState(-43.365894);
  const [networksCountryLength, setNetworksCountryLength] = useState(0);
  const [apiHref, setApiHref] = useState([]);
  const [networksByCountry, setNetworksByCountry] = useState([]);
  const [info, setInfo] = useState([]);
  const [infoLength, setInfoLength] = useState(0);
  const [bikePoint, setBikePoint] = useState([]);
  const [done, setDone] = useState(false);
  const [zoom, setZoom] = useState(5);

  const fetchApi = async () => {
    const {
      data: { networks },
    } = await geoService.getNetworks();
    setApiNetworks(networks);
  }; //salva os dados da API dentro da variável apiNetworks
  useEffect(() => {
    fetchApi();
  }, []); //chama a função somente ao iniciar

  const getSelectValues = (networks) => {
    if (!networks) return;

    let allCountries = [];
    networks.forEach((network) => allCountries.push(network.location.country));
    //pega os países de cada network e retorna um array com todos os países(incluindo valores repetidos)

    const countriesFilter = new Set(allCountries);
    //filtra os países para não haver repetições e retorna um objeto com todoso os páises (sem repetições)
    const contriesArray = [...countriesFilter];
    //transforma em array
    contriesArray.sort();
    //organiza por ordem alfabética
    setSelectValues(contriesArray.sort());
    // pega todos os paises e coloca dentro de um array para ser usado no select
  };

  useEffect(() => {
    if (!apiNetworks) return;
    if (apiNetworks.length > 0) {
      getSelectValues(apiNetworks);
    }
  }, [apiNetworks]);
  // ao consumir a api, ele pega os valores para inserir no select

  const getNetworksByCountry = (networks) => {
    if (!networks) return;
    setNetworksByCountry([]);
    setInfo([]);
    setNetworksCountryLength(0);
    //reseta todas as variáveis

    const getCountry = networks.filter(
      (network) => network.location.country === selectValue,
    ); //filtra por país baseado no input

    setInitialLat(getCountry[0].location.latitude);
    setInitialLong(getCountry[0].location.longitude);
    // define a lat e long iniciais

    setNetworksByCountry(getCountry);
    // chama a função que pega os dados por objeto
  };

  useEffect(() => {
    if (selectValue) {
      getNetworksByCountry(apiNetworks);
    }
  }, [selectValue]); // quando selecionar o país, irá chamar a função getNetworksByCountry

  useEffect(() => {
    handleNeworksByCountry(networksByCountry);
  }, [networksByCountry]);
  // chama a função ao alterar o networksByCountry (ao concluir a função getNetworksByCountry)

  const handleNeworksByCountry = async (data) => {
    if (!data) return;
    setApiHref([]); //quando chamar um novo país irá resetar o state ApiHrefs

    const hrefs = data.map((network) => network.href); //pega os hrefs de cada network

    let promises = [];
    hrefs.forEach((href) => promises.push(handleHrefs(href))); // para cada href irá retornar um promise
    const networksArray = await Promise.all(promises); // resolve todos os promises e coloca os objetos dentro de um array
    setApiHref(networksArray); //passa todos os objetos para uma variável
  };

  const handleHrefs = async (href) => {
    const {
      data: { network },
    } = await geoService.getStations(href);
    //entra em cada href e retorna um objeto com as stations e locations
    return network;
    //pega o objeto retornado e salva ele no state ApiHref
  };

  useEffect(() => {
    if (apiHref.length > 0) {
      handleAllHrefs(apiHref);
    }
  }, [apiHref]);

  const handleAllHrefs = (allHrefs) => {
    let infoArray = [];
    allHrefs.forEach((href) => {
      if (href.stations.length > 0 && href.stations.length !== undefined)
        infoArray.push({
          id: href.name,
          stationsLen: href.stations.length,
          latitude: href.location.latitude,
          longitude: href.location.longitude,
        });
    });
    setInfo(infoArray);

    let popUpArray = [];
    allHrefs.forEach((hrefs) => {
      if (hrefs.stations.length > 0 && hrefs.stations.length !== undefined) {
        hrefs.stations.forEach((href) => {
          popUpArray.push({
            type: 'Feature',
            properties: {
              description: `
                  ${href.name ? `<p>${href.name} </p>` : ''}
                  ${
                    href.empty_slots
                      ? `<p>Empty Slots: ${href.empty_slots} </p>`
                      : ''
                  }
                  ${
                    href.free_bikes
                      ? `<p>Free Bikes: ${href.free_bikes} </p>`
                      : ''
                  }
                  ${href.longitude ? `<p>Long: ${href.longitude} </p>` : ''}
                  ${href.latitude ? `<p>Lat: ${href.latitude} </p>` : ''}
                `,
              icon: 'bicycle',
            },
            geometry: {
              type: 'Point',
              coordinates: [href.longitude, href.latitude],
            },
          });
        });
      }
    });
    //retorna um array com objetos contendo as informações de cada estação, um objeto no formato utilizado para ser exibido no mapa
    setBikePoint(popUpArray);
  };

  useEffect(() => {
    setInfoLength(info.length);
    setZoom(3);
    setDone(!done);
  }, [bikePoint]);
  // quando acabar, conta o total de objetos no array para imprimir na tela

  return (
    <StateContext.Provider
      value={{
        selectValue,
        setSelectValue,
        selectValues,
        initialLat,
        setInitialLat,
        initialLong,
        setInitialLong,
        info,
        infoLength,
        bikePoint,
        networksCountryLength,
        done,
        setDone,
        zoom,
        setZoom,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
