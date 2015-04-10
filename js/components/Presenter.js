import React from 'react';
import Header from './Header.js';
import { Button } from './UI';
let Firebase = require('firebase');
let StyleSheet = require('react-style');
let objectAssign = require('object-assign');

class Presenter extends React.Component {

  constructor(props) {
    this.state = {
      activeLectureKey: props.routeParams.lectureId,
      activeQuestionKey: undefined,
      questions: ['Draw the TCP handshake', 'Draw a HTTP connection', 'Draw a picture of a large bird with dragon wings'],
      responses: []
    };
    for (let i = 0; i < 20; i++) {
      this.state.responses.push({thumbnail: 'http://placehold.it/50x50'});
    }

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
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
      container: {
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        justifyContent: 'center',
        top: 83,
        right: 0,
        bottom: 0,
        left: 0,
        background: '#FBFAFC',
        color: '#543C9C',
      },
      presentationPanelContainer: {
        flexBasis: 1000,
        flexGrow: 0,
        flexShrink: 2,
        display: 'flex',
        justifyContent: 'center',
      },
      presentationPanel: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 1000,
      },
      heading: {
        display: 'flex',
        margin: 20,
        padding: 20,
      },
      dropShadow: {
        border: '1px solid #eee',
        borderBottomColor: '#ddd',
        boxShadow: '0 1px 1px rgba(0,0,0,.15)',
      },
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
      questionPanel: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexGrow: 1,
        alignItems: 'center',
        margin: 20,
        textAlign: 'center',
        color: '#fff',
        background: '#543c9c',
      },
      timer: {
        alignSelf: 'flex-end',
        margin: '5px 20px',
      },
      question: {
        fontSize: '3em',
      },
      buttons: {
        fontSize: 18,
        marginBottom: 20,
      },
      responses: {
        flexGrow: 1,
        margin: 20,
      },
      responseTitle: {
        fontWeight: 200,
        marginLeft: 20,
      },
      questionSelectorContainer: {
        flexGrow: 0,
        flexBasis: 300,
        display: 'flex',
        justifyContent: 'center',
      },
      questionSelector: {
        marginRight: 20,
        flexGrow: 1,
      },
    };

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
      <div>
        <Header/>
        <div style={this.styles.container}>
          <div style={this.styles.presentationPanelContainer}>
            <div style={this.styles.presentationPanel}>
              <div style={objectAssign(this.styles.heading, this.styles.dropShadow)}>
                <div style={this.styles.presenterCode}>
                  <span style={this.styles.presenterCodeTitle}>CODE</span>
                  <span style={this.styles.presenterCodeCode}>b3a</span>
                </div>
                <div style={this.styles.presenterLink}>
                  <span>www.uqdraw.com/b3a</span>
                </div>
              </div>
              <div style={objectAssign(this.styles.questionPanel, this.styles.dropShadow)}>
                <div style={this.styles.timer}>
                  {timer}
                </div>
                <div style={this.styles.question}>
                  <Question question={this.state.questions[this.state.activeQuestionKey]}/>
                </div>
                <div style={this.styles.buttons}>
                  {button}
                </div>
              </div>
              <div style={objectAssign(this.styles.responses, this.styles.dropShadow)}>
                <h2 style={this.styles.responseTitle}>Current Responses</h2>
                <PresenterResponses responses={this.state.responses} onThumbnailClick={this.onThumbnailClick}/>
              </div>
            </div>
          </div>

          <div style={this.styles.questionSelectorContainer}>
            <div style={this.styles.questionSelector}>
              <QuestionSelector questions={this.state.questions} onActivateQuestion={this.onActivateQuestion.bind(this)}/>
            </div>
          </div>
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
  }

  onActivateQuestion(key) {
    this.props.onActivateQuestion(key);
  }

  render() {
    let questions = this.props.questions.map((question, key) => {
      return (
        <div className="Question" style={this.styles.listItem} onClick={this.onActivateQuestion.bind(this, key)}>
          <span>Question {key+1}</span>
        </div>)
      ;
    });
    return (
      <div style={this.styles.questionSelector}>
        <div style={this.styles.list}>
          {questions}
        </div>
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
    };
  }

  render() {

    if (!this.props.question) {
      return (
        <span style={this.styles.unselected}>
          Select a question on the right when you are ready to begin.
        </span>
      );
    }

    return (
      <div>
        <span>{this.props.question}</span>
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
        <a href="" onClick={this.onThumbnailClick.bind(this, key)} style={this.styles.response}>
          <img src={submition.thumbnail}/>
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
    console.log('reset');
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
