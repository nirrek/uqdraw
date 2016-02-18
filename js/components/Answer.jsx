import React, { Component } from 'react';
import generateComponentKey from '../utils/ComponentKey.js';

require('../../css/components/Button.scss');

import PresentationStore from '../stores/PresentationStore.js';
import PresentationActions from '../actions/PresentationActions.js';
import Drawing from '../components/Drawing.jsx';
import { subscribe, unsubscribe, APIConstants } from '../utils/API.js';

export default class Answer extends Component {
  constructor(props) {
    super(props);
    this.componentKey = generateComponentKey();
    this.state = {
      isQuestionOpen: true,
      lectureKey: '-JliFPJmDtXhEAv-YRZ4',
    };
    this.ctx = undefined; // drawing canvas context
    this.onPresentationChange = this.onPresentationChange.bind(this);
    this.getPresentationState = this.getPresentationState.bind(this);
  }

  componentDidMount() {
    this.getPresentationState();
    subscribe(APIConstants.responses, this.componentKey, this.state.lectureKey);
    PresentationStore.addChangeListener(this.onPresentationChange);
  }

  componentDidUnmount() {
    unsubscribe(APIConstants.responses, this.componentKey, this.state.lectureKey);
    PresentationStore.removeChangeListener(this.onPresentationChange);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.activeQuestionKey !== newProps.activeQuestionKey) {
      if (newProps.activeQuestionKey) {
        //activate question
        this.setState({isQuestionActive: true});
      } else {
        //deactivate question
        this.setState({isQuestionActive: false});
      }
    }
  }

  onPresentationChange() {
    this.getPresentationState();
  }

  // Submit the current canvas
  onSubmitImage(dataURL) {
    let response = {
      submitted: Date.now(),
      imageURI: dataURL,
    };
    let lectureKey = '-JliFPJmDtXhEAv-YRZ4';
    let questionKey = '-JmhCbo1eHVVsTEA4TuZ';
    let ref = PresentationActions.createResponse(lectureKey, questionKey, response);
  }

  getPresentationState() {
    this.setState({isSubmitting: PresentationStore.isSubmitting()});
  }

  hideQuestion() {
    this.setState({ isQuestionOpen: false });
  }

  render() {
    let markup;

    var activeStyle = {backgroundColor: '#fff'};
    var smallStyle = (this.state.lineWidth === 's') ? activeStyle : {};
    var mediumStyle = (this.state.lineWidth === 'm') ? activeStyle : {};
    var largeStyle = (this.state.lineWidth === 'l') ? activeStyle : {};

    if (!this.state.isQuestionOpen)
      var questionStyle = {display: 'none'};

    if (this.state.isQuestionActive || true) {
      markup = (
        <div>
          <div className='QuestionOverlay' style={questionStyle}>
            <div className="QuestionOverlay-content" >
              <h3>Draw the 3-way handshake TCP uses to establish a connection</h3>
              <button className='Button' onClick={this.hideQuestion.bind(this)}>Tap To Start Drawing</button>
            </div>
          </div>

          <Drawing activeQuestionKey="1" onSubmitImage={this.onSubmitImage.bind(this)} isSubmitting={this.state.isSubmitting}/>
        </div>
      );
    }

    else {
      markup = (
        <div>There is no currently active question. You must wait for your lecturer to start taking responses before you may draw.</div>
      );
    }

    return (
      <div className='Drawing'>
        {markup}
      </div>
    );
  }
}

Answer.propTypes = {
  activeQuestionKey: React.PropTypes.string,
};
