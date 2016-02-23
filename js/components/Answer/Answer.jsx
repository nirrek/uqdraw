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

export default class Answer extends Component {
  constructor(props) {
    super(props);
    this.componentKey = generateComponentKey();
    this.state = {
      isQuestionOpen: true,
      isQuestionActive: true,
      lectureKey: '-JliFPJmDtXhEAv-YRZ4',
    };
    this.ctx = undefined; // drawing canvas context
    this.onPresentationChange = this.onPresentationChange.bind(this);
    this.getPresentationState = this.getPresentationState.bind(this);
    this.hideQuestion = this.hideQuestion.bind(this);
  }

  componentDidMount() {
    this.getPresentationState();
    subscribe(APIConstants.responses, this.componentKey, this.state.lectureKey);
    PresentationStore.addChangeListener(this.onPresentationChange);
  }

  componentWillUnmount() {
    unsubscribe(APIConstants.responses, this.componentKey, this.state.lectureKey);
    PresentationStore.removeChangeListener(this.onPresentationChange);
  }

  componentWillReceiveProps(nextProps) {
    // TODO enable once backend implemented
    // if (this.props.activeQuestionKey !== newProps.activeQuestionKey) {
    //   this.setState({ isQuestionOpen: Boolean(newProps.activeQuestionKey) });
    // }
  }

  onPresentationChange() {
    this.getPresentationState();
  }

  // Submit the current canvas
  onSubmitImage(dataURL) {
    const response = {
      submitted: Date.now(),
      imageURI: dataURL,
    };
    // TODO make programmatic
    const lectureKey = '-JliFPJmDtXhEAv-YRZ4';
    const questionKey = '-JmhCbo1eHVVsTEA4TuZ';
    createResponse(lectureKey, questionKey, response);
  }

  getPresentationState() {
    this.setState({ isSubmitting: PresentationStore.isSubmitting() });
  }

  hideQuestion() {
    this.setState({ isQuestionOpen: false });
  }

  render() {
    return (
      <div className='Answer'>
        {this.state.isQuestionActive ? (
          <div>
            <Modal isOpen={this.state.isQuestionOpen} onClose={this.hideQuestion} hasCloseButton={false}>
              <ModalContent className=''>
                <h1 className='Answer-question'>
                  Draw the 3-way handshake TCP uses to establish a connection
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
            <Drawing activeQuestionKey="1" onSubmitImage={this.onSubmitImage.bind(this)} isSubmitting={this.state.isSubmitting}/>
          </div>
        ) : (
          <div>There is no currently active question. You must wait for your lecturer to start taking responses before you may draw.</div>
        )}
      </div>
    );
  }
}

Answer.propTypes = {
  activeQuestionKey: React.PropTypes.string,
};
