import React from 'react';
import { useStateContext } from '../../contexts/contextProvider';

import './header.css';

const Header = () => {
  const { setSelectValue, selectValues } = useStateContext();

  return (
    <header className='header'>
      <a href='/' className='header__title'>
        Bikes Map
      </a>
      <div className='select__container'>
        <p>Select country: </p>
        <select
          className='header__select'
          onChange={(e) => {
            setSelectValue(e.target.value);
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
