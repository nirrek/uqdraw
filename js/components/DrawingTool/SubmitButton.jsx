import React, { Component, PropTypes } from 'react';
import Clickable from '../Clickable/Clickable.jsx';
import './SubmitButton.scss';

export default class SubmitButton extends Component {
  render() {
    return (
      <Clickable className='SubmitButton' onClick={this.props.onClick}>
        Submit Answer
      </Clickable>
    );
  }
}

SubmitButton.propTypes = {
  onClick: PropTypes.func.isRequired
};
