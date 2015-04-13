import React from 'react';
import config from '../config.js';
import Header from './Header.js';
import { Button } from './UI';
let Firebase = require('firebase');
let StyleSheet = require('react-style');
let objectAssign = require('object-assign');

require('../../css/components/Presenter.scss');

class Presenter extends React.Component {

  constructor(props) {
    props.onChangeCourse(null, props.routeParams.courseName);
    this.state = {
      activeQuestionKey: undefined,
      responses: [],
      courseId: undefined,
      lecture: {},
      questions: {},
    };
    for (let i = 0; i < 20; i++) {
      this.state.responses.push({thumbnail: 'http://placehold.it/50x50'});
    }

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
    console.log('Activating key ', key);
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
    if (this.state.lecture.questions) {
      questions = this.state.lecture.questions.map((key) => {
        return {
          key: key,
          value: this.state.questions[key],
        };
      });
    }

    let timer;
    if (typeof this.state.activeQuestionKey !== 'undefined') {
      timer = <Timer interval="1000" increment="1000" ref="timer"/>;
    } else {
      timer = null;
    }

    let button;
    if (this.state.takingQuestions) {
      button = <Button key="1" onClick={this.stop}>Stop Taking Responses</Button>;
    } else {
      button = <Button key="2" onClick={this.start}>Start Taking Responses</Button>;
    }
    return (
      <div className='PresenterView'>
        {/* <Header/> */}
        <div className='Column--main'>

          <div className="PresentationDetails">
            <div className="KeyValuePair">
              <div className="Label">Go To</div>
              <div className="Value">uqdraw.co</div>
            </div>
            <div className="KeyValuePair">
              <div className="Label">Enter Code</div>
              <div className="Value">3FA</div>
            </div>
          </div>
          <div className="PresentationQuestion">
            <h2 className='SectionHeading'>Question</h2>
            <Question question={questions[this.state.activeQuestionKey]}/>
            {button}
            <div> {/* TODO figure this out */}
              {timer}
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

class QuestionSelector extends React.Component {

  constructor() {
    this.styles = {
      questionSelector: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flex: '200px 0 1',
        fontSize: 20,
        fontWeight: 200,
      },
      list: {
      },
      listItem: {
        display: 'flex',
        justifyContent: 'center',
        borderBottom: 'solid 1px #ddd',
        padding: '20px 10px',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }
    };

    this.state = {
      styles: this.styles,
    };
  }

  onActivateQuestion(index) {
    this.props.onActivateQuestion(index);
  }

  render() {
    let questions = this.props.questions.map((question, index) => {
      let className = 'PresenterListItem';
      if (question.key === this.props.activeQuestionKey) {
        console.log('FOUND MATCH');
        className += ' PresenterListItem--active';
      }
      return (
        <div key={question.key} className={className} onClick={this.onActivateQuestion.bind(this, question.key)}>
          <span>Question {index+1}</span>
        </div>)
      ;
    });
    return (
      <div className='PresenterList'>
        {questions}
      </div>
    );
  }
}

class Question extends React.Component {

  constructor() {
    this.styles = {
      unselected: {
        fontSize: '0.5em',
        fontStyle: 'italic',
      },
    };

    this.state = {
      takingQuestions: false,
      styles: this.styles,
    };
  }

  render() {

    if (!this.props.question) {
      return (
        <h1 className='Question' /*style={this.styles.unselected}*/>
          Select a question on the right when you are ready to begin.
        </h1>
      );
    }

    return (
      <div>
        <h1 className='Question'>{this.props.question.value}</h1>
      </div>
    );
  }
}

class PresenterResponses extends React.Component {

  onThumbnailClick(key, event) {
    event.preventDefault();
    this.props.onThumbnailClick(key);
  }

  render() {
    this.styles = {
      container: {
        textAlign: 'center',
        color: '#ccc',
        justifyContent: 'center',
      },
      responses: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: 20,
        marginRight: 10,
      },
      response: {
        marginRight: 10,
      },

    };
    // if (!this.props.responses.count) return (<div/>);
    let thumbnails = this.props.responses.map((submition, key) => {
      return (
        <a key={key} href="" onClick={this.onThumbnailClick.bind(this, key)} /*style={this.styles.response}*/>
          <img className='Thumbnail' src={submition.thumbnail}/>
        </a>
      );
    });
    return (
      <div style={this.styles.container}>
        <div style={this.styles.responses}>{thumbnails}</div>
      </div>
    );
  }
}

class Timer extends React.Component {
  constructor() {
    this.state = {
      elapsed: 0,
    };
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.tick = this.tick.bind(this);
  }

  startTimer() {
    if (!this.timer) {
      this.timer = setInterval(this.tick, this.props.interval);
    }
  }

  stopTimer() {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  resetTimer() {
    this.stopTimer();
    this.setState({elapsed: 0});
  }

  tick() {
    this.setState({elapsed: Number(this.state.elapsed) + +Number(this.props.increment)});
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  render() {
    this.styles = {
      container: {
        fontSize: 30,
      }
    };
    let totalSeconds = Math.round(this.state.elapsed / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    if (seconds < 10) { seconds = '0' + seconds; }
    return (
      <div style={this.styles.container}>
        <span>{minutes}:{seconds}</span>
      </div>
    );
  }
}

export default Presenter;
