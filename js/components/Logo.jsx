import React from 'react';

require('../../css/components/Logo.scss');

let m = function(...objects) {
  let result = {};
  objects.forEach((obj) => {
    if (obj) Object.assign(result, obj);
  });
  return result;
};

class Logo extends React.Component {
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

    this.nameStyle = {
      padding: '20px 0',
      display: 'inline-block',
    };

    this.pencilStyle = {
      backgroundImage: 'url("/images/pen.svg")',
      width: 22,
      height: 22,
      display: 'inline-block',
      backgroundSize: 'cover',
      position: 'absolute',
      top: 26,
      marginLeft: -26,
    };
  }

  mouseOver() { this.setState({ isHovered: true }); }

  mouseOut() { this.setState({ isHovered: false }); }

  render() {
    let logoStyle = this.state.isHovered ? this.logoStyle.hovered : {};

    return (
      <div className='Logo' ref='logo'>
        <img className='Logo-img' src='../../images/logo.svg'
             onMouseOver={this.mouseOver.bind(this)}
             onMouseOut={this.mouseOut.bind(this)}
             style={logoStyle}/>
        {/* style={m(
          this.logoStyle.default,
          this.props.logoStyle,
          this.state.isHovered && this.logoStyle.hovered
        )}>
        <span ref="pencil" style={this.pencilStyle}
              onMouseOver={this.mouseOver.bind(this)}
              onMouseOut={this.mouseOut.bind(this)} />
        <span ref="name" style={this.nameStyle}
              onMouseOver={this.mouseOver.bind(this)}
              onMouseOut={this.mouseOut.bind(this)}>UQDraw</span>
        */}
      </div>
    );
  }
}

export default Logo;
