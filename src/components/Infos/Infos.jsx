import React, { useState } from 'react';
import { useStateContext } from '../../contexts/contextProvider';

import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

import './infos.css';

const Infos = () => {
  const { inputValue, networksCountryLength, allNetworks } = useStateContext();

  const [handleNetworks, setHandleNetworks] = useState(false)
  //quando clicar mostra/minimiza os networks na tela

  return (
    <div className='infos'>
      <span>Country: {inputValue}</span>
      <div className='networks' onClick={() => setHandleNetworks(!handleNetworks)}>
        <span>Networks: {networksCountryLength} </span>
        {handleNetworks? <IoIosArrowUp /> :
        <IoIosArrowDown />}
      </div>
      <div className='stations'>
      {handleNetworks
        ? allNetworks.map((station, i) => {
            return (
                <span key={i}>{`${station.id}: ${station.stationsLen}`}</span>
                );
              })
              : null}
        </div>
    </div>
  );
};

export default Infos;
