import React, { useState } from 'react';
import { useStateContext } from '../../contexts/contextProvider';

import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

import './infos.css';

const Infos = () => {
  const { selectValue, infoLength, info } = useStateContext();

  const [handleNetworks, setHandleNetworks] = useState(false)
  //quando clicar mostra/minimiza os networks na tela

  return (
    <div className='infos'>
      <span>Country: {selectValue}</span>
      <div className='networks' onClick={() => setHandleNetworks(!handleNetworks)}>
        <span>Networks: {infoLength} </span>
        {handleNetworks? <IoIosArrowUp /> :
        <IoIosArrowDown />}
      </div>
      <div className='stations'>
      {handleNetworks
        ? info.map((station, i) => {
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
