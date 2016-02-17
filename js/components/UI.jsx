import React, { Component } from 'react';

export class Button extends Component {
  shouldComponentUpdate() { return false; }
  render() {
    return (
      <button className="Button" onClick={this.props.onClick}>
        {this.props.children}
      </button>);
  }
}
