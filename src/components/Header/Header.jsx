import React from 'react';
import { useStateContext } from '../../contexts/contextProvider';

import './header.css';

const Header = () => {
  const { setInputValue, selectValues } = useStateContext();

  return (
    <header className='header'>
      <a href='/' className='header__title'>
        City Bike
      </a>
      <div>
        <p>Select country: </p>
        <select
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        >
          {selectValues === [] ? (
            <option value='BR'>Brasil</option>
          ) : (
            selectValues.map((value, i) => {
              return (
                <option value={value} key={i}>
                  {value}
                </option>
              );
            })
          )}
        </select>
      </div>
    </header>
  );
};

export default Header;
