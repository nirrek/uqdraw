import React from 'react';

class Button extends React.Component {
  shouldComponentUpdate() { return false; }
  render() {
    return (
      <button className="Button" onClick={this.props.onClick}>
        {this.props.children}
      </button>);
  }
}

export {Button};
