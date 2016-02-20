import React, { Component, PropTypes } from 'react';
import './ModalFooter.scss';

export default class ModalFooter extends Component {
  render() {
    return (
      <div className='ModalFooter'>
        {this.props.children}
      </div>
    );
  }
}

ModalFooter.propTypes = {
  children: PropTypes.node,
};
