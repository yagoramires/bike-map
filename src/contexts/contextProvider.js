/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from 'react';

import geoService from '../api/geoService';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [selectValue, setSelectValue] = useState();
  const [selectValues, setSelectValues] = useState([]);
  const [initialLat, setInitialLat] = useState(-23.000372);
  const [initialLong, setInitialLong] = useState(-43.365894);
  const [apiNetworks, setApiNetworks] = useState([]);
  const [networksCountryLength, setNetworksCountryLength] = useState(0);
  const [apiHrefs, setApiHrefs] = useState();
  const [apiHref, setApiHref] = useState([]);
  const [networksByCountry, setNetworksByCountry] = useState([]);
  const [info, setInfo] = useState([]);
  const [infoLength, setInfoLength] = useState(0);
  const [bikePoint, setBikePoint] = useState([]);
  const [done, setDone] = useState(false);

  const fetchApi = async () => {
    const {
      data: { networks },
    } = await geoService.getNetworks();
    setApiNetworks(networks);
  };
  //salva os dados da API dentro da variável apiNetworks
  useEffect(() => {
    fetchApi();
  }, []);
  //chama a função ao iniciar

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
      (network) => network.location.country === selectValue
    );
    //filtra por país baseado no input

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
  }, [selectValue]);
  // quando selecionar o país, irá chamar a função getNetworksByCountry

  useEffect(() => {
    handleNeworksByCountry(networksByCountry);
  }, [networksByCountry]);
  // chama a função ao alterar o networksByCountry (ao concluir a função getNetworksByCountry)

  const handleNeworksByCountry = (data) => {
    if (!data) return;
    setApiHref([]);
    //quando chamar um novo país irá resetar o state ApiHrefs
    const hrefs = data.map((network) => network.href);
    //pega os hrefs de cada network

    let networksArray = [];
    hrefs.map(async (href) => {
      const res = await handleHrefs(href);
      networksArray.push(res);
    });

    setApiHref(networksArray);
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
    console.log(apiHref);
    if (apiHref.length > 0) {
      handleAllHrefs(apiHref);
    }
  }, [apiHref]);

  // useEffect(() => {
  //   const allHrefs = apiHrefs.concat(apiHref); //concatena todos ApiHrefs dentro de uma variavel ApiHrefs
  //   setApiHrefs(allHrefs);
  // }, [apiHref]); //a cada vez que alterar o apiHref ira concatenar

  const handleAllHrefs = (allHrefs) => {
    console.log(allHrefs);

    let infoArray = [];
    allHrefs.forEach((href) => {
      if (href.stations.length > 0 && href.stations.length !== undefined)
        infoArray.push({
          id: href.name,
          stationsLen: href.stations.length,
        });
    });
    setInfo(infoArray);

    let popUpArray = [];
    allHrefs.forEach((href) => {
      if (href.stations.length > 0 && href.stations.length !== undefined)
        popUpArray.push({
          'type': 'Feature',
          'properties': {
            'description': `
              ${href.name ? `<p>Free Bikes: ${href.name} </p>` : ''}
              ${
                href.empty_slots
                  ? `<p>Free Bikes: ${href.empty_slots} </p>`
                  : ''
              }
              ${href.free_bikes ? `<p>Free Bikes: ${href.free_bikes} </p>` : ''}
              ${href.longitude ? `<p>Free Bikes: ${href.longitude} </p>` : ''}
              ${href.latitude ? `<p>Free Bikes: ${href.latitude} </p>` : ''}
            `,
            'icon': 'bicycle',
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [href.longitude, href.latitude],
          },
        });
    });
    //retorna um array com objetos contendo as informações de cada estação, um objeto no formato utilizado para ser exibido no mapa

    setBikePoint(popUpArray);
    console.log(popUpArray);
  };

  useEffect(() => {
    setInfoLength(info.length);
  }, [done]);
  // quando acabar, conta o total de objetos no array para imprimir na tela

  return (
    <StateContext.Provider
      value={{
        selectValue,
        setSelectValue,
        selectValues,
        initialLat,
        initialLong,
        info,
        infoLength,
        bikePoint,
        networksCountryLength,
        // done,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
