import React, { Component, PropTypes } from 'react';

const focusNode = (node) => node && node.focus();
const blurNode = (node) => node && node.blur();

export default class FocusableInput extends Component {
  render() {
    const { isFocused, ...rest } = this.props;
    const focusInput = isFocused ? focusNode : blurNode;
    return (
      <input ref={focusInput} {...rest} />
    );
  }
}

FocusableInput.propTypes = {
  isFocused: PropTypes.bool,
};
