import React, { Component, PropTypes } from 'react';
import PenSelector from './PenSelector.jsx';
import Spinner from 'react-spinkit';
import Button from '../Button/Button.jsx';
import Clickable from '../Clickable/Clickable.jsx';
import EraserToggler from './EraserToggler.jsx';
import SubmitButton from './SubmitButton.jsx';
import cn from 'classnames';
import './ActionBar.scss';

export default class ActionBar extends Component {
  render() {
    const {
      currentPen,
      isEraserActive,
      onEraserToggle,
      onPenSelect,
      onSubmit,
      isSubmitting
    } = this.props;

    return (
      <div className='ActionBar'>
        <div className='ActionBar-item'>
          <EraserToggler isActive={isEraserActive} onClick={onEraserToggle} />
        </div>

        <div className='ActionBar-item ActionBar-item--main'>
          {isSubmitting ? (
            <Spinner spinnerName='double-bounce' noFadeIn />
          ) : (
            <SubmitButton onClick={onSubmit} />
          )}
        </div>

        <div className='ActionBar-item'>
          <PenSelector pen={currentPen} onPenSelect={onPenSelect} />
        </div>
      </div>
    );
  }
}

ActionBar.propTypes = {
  currentPen: PropTypes.object,
  isEraserActive: PropTypes.bool,
  onEraserToggle: PropTypes.func,
  onPenSelect: PropTypes.func,
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

