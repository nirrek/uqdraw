import React, { Component } from 'react';
import Button from '../Button/Button.jsx';
import Timer from '../Timer/Timer.jsx';
import LectureStore from '../../stores/LectureStore.js';
import PresentationStore from '../../stores/PresentationStore.js';
import generateComponentKey from '../../utils/ComponentKey.js';
import { subscribe, unsubscribe, APIConstants } from '../../utils/API.js';
import QuestionSelector from './PresenterQuestionSelector.jsx';
import PresenterQuestion from './PresenterQuestion.jsx';
import PresenterResponses from './PresenterResponses.jsx';
import './Presenter.scss';

import sortBy from 'lodash/sortBy';
import { connect } from 'react-redux';
import * as PresentationActions from '../../actions/PresentationActions.js';

class Presenter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { presentation } = this.props;
    const questions = sortBy(presentation.questions, ['listPosition']);
    const currentQuestion = getCurrentQuestion(presentation);
    const currentResponses = {}; // TODO implement

    const activateQuestion = (questionId) => {
      this.props.activateQuestion(presentation.id, questionId);
    }

    const handleStartAcceptingResponses = () => {
      this.props.startAcceptingResponses(presentation.id);
    }

    const handleStopAcceptingResponses = () => {
      this.props.stopAcceptingResponses(presentation.id);
    }

    return (
      <div className='PresenterView'>
        <div className='Column--main'>

          <div className="PresentationDetails">
            <div className="Step">
              <div className='Step-number'>1</div>
              <div className='Step-instructions'>
                <span className='Step-label'>Go to</span><span className='Step-value'>uqdraw.co</span>
              </div>
            </div>
            <div className="Step">
              <div className='Step-number'>2</div>
              <div className='Step-instructions'>
                <span className='Step-label'>Enter code</span><span className='Step-value'>{presentation.code}</span>
              </div>
            </div>
          </div>
          <div className="PresentationQuestion">
            <h2 className='SectionHeading'>Question</h2>
            {currentQuestion ? (
              <PresenterQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                onStartAcceptingResponses={handleStartAcceptingResponses}
                onStopAcceptingResponses={handleStopAcceptingResponses}
                isAcceptingResponses={presentation.isAcceptingResponses}
                timeElapsed={currentQuestion.timeElapsed}
                onTimerTick={this.props.responseTimerTick} />
            ) : (
              <h3 className='PresentationQuestion-hint'>
                Select a question on the right when you are ready to begin.
              </h3>
            )}
          </div>
          <div className="PresentationResponses">
            <h2 className='SectionHeading'>Responses</h2>
            <div className="ResponseThumbnails">
              <PresenterResponses responses={currentResponses} onThumbnailClick={() => {}}/>
            </div>
          </div>
        </div>

        <div className='Column--supporting'>
          <QuestionSelector
            questions={questions}
            currentQuestion={currentQuestion}
            onSelect={activateQuestion} />
        </div>
      </div>
    );
  }
}

// getCurrentQuestion :: Object -> Object | null
const getCurrentQuestion = (presentation) => {
  if (!presentation.currentQuestion) return null;
  return presentation.questions
    .find(q => q.id === presentation.currentQuestion.id);
}

// Selectors
const activePresentation = (state) => {
  const { presentations } = state;
  return presentations.presentations[presentations.activePresentationId];
}

export default connect(
  (state) => ({
    presentation: activePresentation(state),
  }),
  {
    activateQuestion: PresentationActions.activateQuestion,
    startAcceptingResponses: PresentationActions.startAcceptingResponses,
    stopAcceptingResponses: PresentationActions.stopAcceptingResponses,
    responseTimerTick: PresentationActions.responseTimerTick,
  }
)(Presenter);
