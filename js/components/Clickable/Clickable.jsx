import React, { Component, PropTypes } from 'react';
import './Clickable.scss';

export default class Clickable extends Component {
  render() {
    const { className, children, ...rest } = this.props;
    return (
      <div className={`Clickable ${className}`} {...rest}>
        {children}
      </div>
    )
  }
}
