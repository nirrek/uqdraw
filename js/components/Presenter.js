import React from 'react';
import config from '../config.js';
import Header from './Header.js';
import { Button } from './UI';

import QuestionSelector from './QuestionSelector.js';
import PresenterQuestion from './PresenterQuestion.js';
import PresenterResponses from './PresenterResponses.js';
import Timer from './Timer.js';

let Firebase = require('firebase');
let StyleSheet = require('react-style');
let objectAssign = require('object-assign');

require('../../css/components/Presenter.scss');

class Presenter extends React.Component {

  constructor(props) {
    super(props);
    props.onChangeCourse(null, props.routeParams.courseName);
    this.state = {
      activeQuestionKey: undefined,
      responses: [],
      courseId: undefined,
      lecture: {},
      questions: {},
    };

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
    this.getLecture = this.getLecture.bind(this);
    this.getquestions = this.getQuestions.bind(this);
  }

  componentDidMount() {
    if (this.props.courseId) {
      this.getLecture(this.props.courseId);
      this.getQuestions(this.props.courseId);
    }

    this.observeFirebaseResponses();
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.courseId) {
      if (newProps.courseId) {
        this.getLecture(newProps.courseId);
        this.getquestions(newProps.courseId);
      }
    }
  }

  componentWillUnmount() {
    this.lectureRef.off();
    this.questionsRef.off();
    this.responsesRef.off();
  }

  // Setup responses endpoint observer to update responses state as new
  // responses are submitted. Current endpoint is hardocded temporarily
  // for Kerrins presentation.
  observeFirebaseResponses() {
    this.responsesRef = new Firebase(`${config.firebase.base}/presentations/3fa/responses`);
    this.responsesRef.on('value', (snapshot) => {
      let responses = snapshot.val() || {};
      responses = Object.keys(responses).map((key) => {
        return responses[key].submissionDataURI;
      });
      this.setState({ responses });
    });
  }

  getLecture(courseId) {
    this.lectureRef = new Firebase(`${config.firebase.base}/lectures/${courseId}`);
    this.lectureRef.on('value', (snapshot) => {
      let lectures = snapshot.val() || {};
      this.setState({lecture: lectures[this.props.routeParams.lectureId]});
    });
  }

  getQuestions(courseId) {
    this.questionsRef = new Firebase(`${config.firebase.base}/questions/${courseId}`);
    this.questionsRef.on('value', (snapshot) => {
      let content = snapshot.val() || {};
      this.setState({questions: content});
    });
  }

  onActivateQuestion(key) {
    this.setState({activeQuestionKey: key});
    this.reset();
  }

  onThumbnailClick(key) {
    console.log('make a large version of submition '+key);
  }

  start() {
    this.setState({takingQuestions: true});
    this.refs.timer.startTimer();
  }

  stop() {
    this.setState({takingQuestions: false});
    this.refs.timer.stopTimer();
  }

  reset() {
    this.setState({takingQuestions: false});
    if (this.refs.timer) {
      this.refs.timer.resetTimer();
    }
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
    if (this.state.lecture.questions) {
      questions = this.state.lecture.questions.map((key) => {
        return {
          key: key,
          value: this.state.questions[key],
        };
      });

      // Find the currently active question
      questions.forEach((q) => {
        if (q.key === this.state.activeQuestionKey)
          activeQuestion = q;
      });
    }

    if (typeof this.state.activeQuestionKey !== 'undefined') {
      var timer = <Timer interval="1000" increment="1000" ref="timer"/>;
      if (this.state.takingQuestions) {
        var button = <Button key="1" onClick={this.stop}>Stop Taking Responses</Button>;
      } else {
        var button = <Button key="2" onClick={this.start}>Start Taking Responses</Button>;
      }
    }

    return (
      <div className='PresenterView'>
        {/* <Header/> */}
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
            <PresenterQuestion question={activeQuestion}/>
            <div className='Timer'>
              {timer}
              {button}
            </div>
          </div>
          <div className="PresentationResponses">
            <h2 className='SectionHeading'>Responses</h2>
            <div className="ResponseThumbnails">
              <PresenterResponses responses={this.state.responses} onThumbnailClick={this.onThumbnailClick}/>
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

export default Presenter;
