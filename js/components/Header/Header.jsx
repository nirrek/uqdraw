import React, { Component } from 'react';
import Logo from '../Logo.jsx';
import './Header.scss';

export default class Header extends Component {
  shouldComponentUpdate() {
    return false; // immutable component
  }

  render() {
    return (
      <header className='Header'>
        <Logo />
        {this.props.children}
      </header>
    );
  }
}

export default Header;
