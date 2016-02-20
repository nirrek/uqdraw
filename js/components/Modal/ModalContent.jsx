import React, { Component, PropTypes } from 'react';
import './ModalContent.scss';

export default class ModalContent extends Component {
  render() {
    return (
      <div className="ModalContent">
        {this.props.children}
      </div>
    );
  }
}

ModalContent.propTypes = {
  children: PropTypes.node,
};
