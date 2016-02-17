import React, { Component } from 'react';
require('../../css/components/Logo.scss');

export default class Logo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHovered: false
    };

    this.logoStyle = {
      default: {
        fontSize: 25,
        fontWeight: 800,
        textTransform: 'uppercase',
        backgroundColor: 'rgba(0,0,0,.1)',
        borderBottom: '1px solid rgba(0,0,0,.05)',
        color: '#E1DDED',
        transition: 'opacity 0.3s ease-out',
      },
      hovered: {
        opacity: 0.8,
        cursor: 'pointer',
      },
    };
  }

  mouseOver() { this.setState({ isHovered: true }); }

  mouseOut() { this.setState({ isHovered: false }); }

  render() {
    let logoStyle = this.state.isHovered ? this.logoStyle.hovered : {};

    return (
      <div className='Logo' ref='logo'>
        <img className='Logo-img' src={require('../../images/logo.svg')}
             onMouseOver={this.mouseOver.bind(this)}
             onMouseOut={this.mouseOut.bind(this)}
             style={logoStyle}/>
      </div>
    );
  }
}
