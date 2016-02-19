import React, { Component } from 'react';
import '../../css/components/Logo.scss';
import logoPath from '../../images/logo.svg';

export default class Logo extends Component {
  shouldComponentUpdate() {
    return false; // immutable component
  }

  render() {
    return (
      <div className='Logo' ref='logo'>
        <img className='Logo-img' src={logoPath} />
      </div>
    );
  }
}
