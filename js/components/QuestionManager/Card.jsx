import React, { Component, PropTypes } from 'react';
import './Card.scss';

export default class Card extends Component {
  render() {
    const { isCloseable, onClose } = this.props;

    return (
      <div className='Card' draggable={true}>
        {isCloseable && (
          <div className='Card-close' onClick={() => onClose()}>
            &times;
          </div>
        )}
        {this.props.children}
      </div>
    );
  }
}

Card.propTypes = {
  isCloseable: PropTypes.bool,
};

Card.defaultProps = {
  isCloseable: true,
};
