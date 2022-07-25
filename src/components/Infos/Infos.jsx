import React, { useState } from 'react';
import { useStateContext } from '../../contexts/contextProvider';

import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

import './infos.css';

const Infos = () => {
  const { inputValue, networksCountryLength, allNetworks } = useStateContext();

  const [handleNetworks, setHandleNetworks] = useState(false)

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
        ? allNetworks.map((station) => {
            return (
                <span>{`${station.id}: ${station.stationsLen}`}</span>
                );
              })
              : null}
        </div>
    </div>
  );
};

export default Infos;
