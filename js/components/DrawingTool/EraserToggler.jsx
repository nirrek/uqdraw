import React, { Component, PropTypes } from 'react';
import cn from 'classnames';
import Clickable from '../Clickable/Clickable.jsx';
import './EraserToggler.scss';

export default class EraserToggler extends Component {
  render() {
    const { isActive, onClick } = this.props;
    const classList = cn({
      'Eraser': true,
      'Eraser--active': isActive
    });

    return (
      <Clickable className={classList} onClick={onClick} />
    );
  }
}

EraserToggler.propTypes = {
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};
