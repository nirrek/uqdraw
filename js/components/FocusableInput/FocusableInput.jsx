import React, { Component, PropTypes } from 'react';
import { noop } from '../../utils/utils.js';

export default class FocusableInput extends Component {
  render() {
    const { isFocused, ...rest } = this.props;

    const focusInput = isFocused ?
      (node) => node && node.focus() :
      noop;

    return (
      <input ref={focusInput} {...rest} />
    );
  }
}

FocusableInput.propTypes = {
  isFocused: PropTypes.bool,
};
