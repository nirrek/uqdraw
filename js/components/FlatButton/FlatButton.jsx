import React, { Component, PropTypes } from 'react';
import cn from 'classnames';
import './FlatButton.scss';

export default class FlatButton extends Component {
  render() {
    const { type, onClick, children } = this.props;
    const classList = cn({
      'FlatButton': true,
      'FlatButton--primary': type === 'primary',
      'FlatButton--secondary': type === 'secondary',
    });

    return (
      <button className={classList} onClick={onClick}>
        {children}
      </button>
    );
  }
}

FlatButton.propTypes = {
  type: PropTypes.oneOf(['primary', 'secondary']),
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

FlatButton.defaultProps = {
  type: 'primary',
};
