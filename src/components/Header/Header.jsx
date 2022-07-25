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
