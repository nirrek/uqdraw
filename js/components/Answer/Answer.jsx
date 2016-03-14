import React, { Component } from 'react';
import generateComponentKey from '../../utils/ComponentKey.js';
import PresentationStore from '../../stores/PresentationStore.js';
import { createResponse } from '../../actions/PresentationActions.js';
import Drawing from '../../components/DrawingTool/DrawingTool.jsx';
import { subscribe, unsubscribe, APIConstants } from '../../utils/API.js';
import Button from '../Button/Button.jsx';
import Modal, { ModalContent, ModalFooter } from '../Modal/Modal.jsx';
import FlatButton from '../FlatButton/FlatButton.jsx';
import './Answer.scss';

import { connect } from 'react-redux';
import * as PresentationViewerActions from '../../actions/PresentationViewerActions.js';

class Answer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isQuestionOpen: true,
    };
    this.ctx = undefined; // drawing canvas context
    this.hideQuestion = this.hideQuestion.bind(this);
    this.onSubmitImage = this.onSubmitImage.bind(this)
  }

  // Submit the current canvas
  onSubmitImage(imageDataUrl) {
    const { response, presentation } = this.props;
    response(presentation.id, presentation.currentQuestion.id, imageDataUrl);

    // const response = {
    //   submitted: Date.now(),
    //   imageURI: dataURL,
    // };
    // // TODO make programmatic
    // const lectureKey = '-JliFPJmDtXhEAv-YRZ4';
    // const questionKey = '-JmhCbo1eHVVsTEA4TuZ';
    // createResponse(lectureKey, questionKey, response);
  }

  hideQuestion() {
    this.setState({ isQuestionOpen: false });
  }

  render() {
    const { presentation } = this.props;

    return presentation.currentQuestion ? (
      <div className='Answer'>
        <Modal isOpen={this.state.isQuestionOpen} onClose={this.hideQuestion} hasCloseButton={false}>
          <ModalContent className=''>
            <h1 className='Answer-question'>
              {presentation.currentQuestion.text}
            </h1>
          </ModalContent>
          <ModalFooter>
            <div className='Answer-button'>
              <FlatButton onClick={this.hideQuestion}>
                Tap To Start Drawing
              </FlatButton>
            </div>
          </ModalFooter>
        </Modal>
        <Drawing
          hasSubmitted={this.props.hasResponded}
          onSubmitImage={this.onSubmitImage}
          isSubmitting={this.props.isSendingResponse} />
      </div>
    ) : (
      <div className='Answer'>There is no currently active question. You must wait for your lecturer to start taking responses before you may draw.</div>
    );
  }
}

Answer.propTypes = {
  activeQuestionKey: React.PropTypes.string,
};

// Selectors
const getPresentationViewer = (state) => state.presentationViewer;

export default connect(
  (state) => {
    const presentationViewer = getPresentationViewer(state)
    return {
      presentation: presentationViewer.presentation,
      isSendingResponse: presentationViewer.isSendingResponse,
      sendResponseError: presentationViewer.sendResponseError,
      hasResponded: presentationViewer.hasResponded,
    };
  },
  {
    response: PresentationViewerActions.response,
  }
)(Answer);
