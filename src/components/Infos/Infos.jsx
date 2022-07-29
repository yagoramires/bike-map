import React, { useState } from 'react';
import { useStateContext } from '../../contexts/contextProvider';

import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

import './infos.css';

const Infos = () => {
  const {
    selectValue,
    infoLength,
    info,
    done,
    setDone,
    setInitialLat,
    setInitialLong,
    setZoom,
  } = useStateContext();

  const [handleNetworks, setHandleNetworks] = useState(false);
  //quando clicar mostra/minimiza os networks na tela

  const handleClick = (lat, long) => {
    setInitialLat(lat);
    setInitialLong(long);
    setZoom(10);
    setDone(!done);
  };

  return (
    <div className='infos'>
      <span>Country: {selectValue}</span>
      <div
        className='networks'
        onClick={() => setHandleNetworks(!handleNetworks)}
      >
        <span>Networks: {infoLength} </span>
        {handleNetworks ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </div>
      <div className='stations'>
        {handleNetworks
          ? info.map((station, i) => {
              return (
                <div
                  key={i}
                  className='station'
                  onClick={() =>
                    handleClick(station.latitude, station.longitude)
                  }
                >
                  <span>{`${station.id}`} </span>
                  <span>{`${station.stationsLen}`} </span>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default Infos;
