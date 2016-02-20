import React, { Component, PropTypes } from 'react';
import cn from 'classnames';
import { noop } from '../../utils/utils.js';
import './Button.scss';

export default class Button extends Component {
  render() {
    const { type, onClick } = this.props;

    const classList = cn({
      'Button': true,
      'Button': type !== 'unstyled' || type === 'primary',
      'Button--secondary': type === 'secondary',
      'Button--unstyled': type === 'unstyled',
    });

    return (
      <button className={classList} onClick={onClick}>
        {this.props.children}
      </button>
    );
  }
}

Button.propTypes = {
  type: PropTypes.oneOf(['', 'primary', 'secondary', 'unstyled']),
  onClick: PropTypes.func,
};

Button.defaultProps = {
  type: '',
  onClick: noop,
}
