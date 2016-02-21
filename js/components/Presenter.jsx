import React, { Component } from 'react';
import Button from './Button/Button.jsx';

import QuestionSelector from './QuestionSelector.jsx';
import PresenterQuestion from './PresenterQuestion.jsx';
import PresenterResponses from './PresenterResponses.jsx';
import Timer from './Timer/Timer.jsx';

import LectureStore from '../stores/LectureStore.js';
import PresentationStore from '../stores/PresentationStore.js';

import generateComponentKey from '../utils/ComponentKey.js';
import { subscribe, unsubscribe, APIConstants } from '../utils/API.js';

require('../../styles/components/Presenter.scss');

export default class Presenter extends Component {

  constructor(props) {
    super(props);
    props.onChangeCourse(null, props.routeParams.courseName);
    this.componentKey = generateComponentKey();
    this.state = {
      activeQuestionKey: undefined,
      responses: [],
      courseId: undefined,
      lecture: {},
      isTakingResponses: false,
      timeElapsed: 0,
    };

    this.startTakingResponses = this.startTakingResponses.bind(this);
    this.stopTakingResponses = this.stopTakingResponses.bind(this);
    this.initData = this.initData.bind(this);
    this.onLectureChange = this.onLectureChange.bind(this);
    this.onPresentationChange = this.onPresentationChange.bind(this);
    this.handleTick = this.handleTick.bind(this);
  }

  componentDidMount() {
    // Listen for store changes
    LectureStore.addChangeListener(this.onLectureChange);
    PresentationStore.addChangeListener(this.onPresentationChange);
    this.initData(this.props.courseId);
  }

  componentWillReceiveProps(newProps) {
    this.initData(newProps.courseId);
  }

  componentWillUnmount() {
    let lectureKey = this.props.routeParams.lectureId;
    LectureStore.removeChangeListener(this.onLectureChange);
    PresentationStore.removeChangeListener(this.onPresentationChange);
    unsubscribe(APIConstants.lectures, this.componentKey, this.props.courseId);
    unsubscribe(APIConstants.responses, this.componentKey, lectureKey);
  }

  initData(courseKey) {
    if (courseKey) {
      let lectureKey = this.props.routeParams.lectureId;
      let lecture = LectureStore.getAll(lectureKey);
      this.setState({lecture: lecture});
      this.setState({responses: PresentationStore.getResponses(lectureKey)});
      subscribe(APIConstants.lectures, this.componentKey, courseKey);
      subscribe(APIConstants.responses, this.componentKey, lectureKey);
    }
  }

  onLectureChange() {
    let lecture = LectureStore.get(this.props.courseId, this.props.routeParams.lectureId);
    this.setState({'lecture': lecture});
  }

  onPresentationChange() {
    this.setState({'responses': PresentationStore.getResponses(this.props.routeParams.lectureId)});
  }

  onActivateQuestion(key) {
    this.setState({
      activeQuestionKey: key,
      timeElapsed: 0,
    });
  }

  onThumbnailClick(key) {
    console.log('make a large version of submission ' + key);
  }

  handleTick(timeElapsed) {
    this.setState({ timeElapsed });
  }

  startTakingResponses() {
    this.setState({ isTakingResponses: true });
  }

  stopTakingResponses() {
    this.setState({ isTakingResponses: false });
  }

  render() {
    this.styles = {
      presenterCode: {
        display: 'flex',
        flexDirection: 'column',
      },
      presenterCodeTitle: {
        fontSize: 22,
        letterSpacing: '8px',
      },
      presenterCodeCode: {
        fontSize: 50,
        lineHeight: 0.8,
      },
      presenterLink: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        fontSize: 50,
      },
      timer: {
        alignSelf: 'flex-end',
        margin: '5px 20px',
      },
    };

    let questions = [];
    let activeQuestion;
    let activeQuestionComponent;
    if (this.state.lecture && this.state.lecture.questions && this.state.lecture.questionOrder) {
      questions = this.state.lecture.questionOrder.map((key) => {
        return {
          key: key,
          value: this.state.lecture.questions[key],
        };
      });

      // Find the currently active question
      questions.forEach((q) => {
        if (q.key === this.state.activeQuestionKey) {
          activeQuestion = q;
          if (activeQuestion) {
            activeQuestionComponent = <PresenterQuestion question={activeQuestion}/>;
          }
        }
      });
    }

    if (typeof this.state.activeQuestionKey !== 'undefined') {
      var timer = <Timer interval="1000" increment="1000" ref="timer"/>;
      var button;
      if (this.state.isTakingResponses) {
        button = <Button key="1" onClick={this.stopTakingResponses}>Stop Taking Responses</Button>;
      } else {
        button = <Button key="2" onClick={this.startTakingResponses}>Start Taking Responses</Button>;
      }
    }

    let activeResponses;
    if (typeof this.state.activeQuestionKey !== 'undefined') {
      activeResponses = this.state.responses[this.state.activeQuestionKey];
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
                <span className='Step-label'>Enter code</span><span className='Step-value'>3fa</span>
              </div>
            </div>
          </div>
          <div className="PresentationQuestion">
            <h2 className='SectionHeading'>Question</h2>
            {activeQuestionComponent}
            <div className='Timer'>
              {timer}
              {button}
            </div>

            <Timer time={this.state.timeElapsed}
                   isRunning={this.state.isTakingResponses}
                   onTick={this.handleTick} />
          </div>
          <div className="PresentationResponses">
            <h2 className='SectionHeading'>Responses</h2>
            <div className="ResponseThumbnails">
              <PresenterResponses responses={activeResponses || {}} onThumbnailClick={this.onThumbnailClick}/>
            </div>
          </div>
        </div>

        <div className='Column--supporting'>
          <QuestionSelector questions={questions} onActivateQuestion={this.onActivateQuestion.bind(this)} activeQuestionKey={this.state.activeQuestionKey}/>
        </div>
      </div>
    );
  }
}
