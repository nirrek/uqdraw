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
      hasSubmitted,
      onSubmit,
      isSubmitting
    } = this.props;

    let submitButton;
    if (hasSubmitted) {
      submitButton = <div>Answer Submitted</div>;
    } else if (isSubmitting) {
      submitButton = <Spinner spinnerName='double-bounce' noFadeIn />;
    } else {
      submitButton = <SubmitButton onClick={onSubmit} />;
    }

    return (
      <div className='ActionBar'>
        <div className='ActionBar-item'>
          <EraserToggler isActive={isEraserActive} onClick={onEraserToggle} />
        </div>
        <div className='ActionBar-item ActionBar-item--main'>
          {submitButton}
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
  hasSubmitted: PropTypes.bool,
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

