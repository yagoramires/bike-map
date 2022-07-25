import React from 'react';
import { useStateContext } from '../../contexts/contextProvider';

import './header.css';

const Header = () => {
  const { setInputValue } = useStateContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    setInputValue(e.target[0].value);
  };

  return (
    <header className='header'>
      <h1 className='header__title'>City Bike</h1>
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
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          className='header__input'
          placeholder='Search City'
        />
      </form>
    </header>
  );
};

export default Header;
