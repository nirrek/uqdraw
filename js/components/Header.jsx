import React from 'react';
import Logo from './Logo.jsx';

class Header extends React.Component {
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
