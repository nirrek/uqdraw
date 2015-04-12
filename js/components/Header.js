import React from 'react';
import Logo from './Logo.js';

class Header extends React.Component {
  shouldComponentUpdate() { return false; }

  render() {
    return (
      <header>
        <Logo />
      </header>
    );
  }
}

export default Header;
