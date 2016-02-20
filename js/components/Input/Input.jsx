import React, { Component, PropTypes } from 'react';
import './Input.scss';

export default class Input extends Component {
  render() {
    return (
      <input
        type="text"
        className="Input"
        {...this.props} />
    );
  }
}
