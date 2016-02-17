import React, { Component } from 'react';
require('../../css/components/Logo.scss');

export default class Logo extends Component {
  shouldComponentUpdate() {
    return false; // immutable component
  }

  render() {
    return (
      <div className='Logo' ref='logo'>
        <img className='Logo-img' src={require('../../images/logo.svg')} />
      </div>
    );
  }
}
