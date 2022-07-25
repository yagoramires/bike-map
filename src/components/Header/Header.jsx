import React from 'react';
import { useStateContext } from '../../contexts/contextProvider';

import './header.css';

const Header = () => {
  const { setInputValue } = useStateContext();

  return (
    <header className='header'>
      <a href='/' className='header__title'>City Bike</a>
      <select
        onClick={(e) => {
          setInputValue(e.target.value);
        }}
      >
        <option value='BR'>Brasil</option>
        <option value='PT'>Portugal</option>
        <option value='ES'>Spain</option>
        <option value='US'>United States</option>
        <option value='RU'>Russia</option>
      </select>

    </header>
  );
};

export default Header;
