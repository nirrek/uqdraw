import React, { Component } from 'react';
import Logo from './Logo.jsx';

export default class Header extends Component {
  shouldComponentUpdate() { return false; }

  render() {
    return (
      <header>
        <Logo />
        {this.props.children}
      </header>
    );
  }
}

export default Header;
