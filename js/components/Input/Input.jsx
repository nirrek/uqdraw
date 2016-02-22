import React, { Component, PropTypes } from 'react';
import './Input.scss';

export default class Input extends Component {
  render() {
    const { type, className, ...rest } = this.props;
    const classList = className ? `Input ${className}` : 'Input';

    return (
      <input
        {...rest}
        type={type}
        className={classList} />
    );
  }
}

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'password'])
};

Input.defaultProps = {
  type: 'text'
};
