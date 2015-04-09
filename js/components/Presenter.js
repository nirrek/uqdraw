import React from 'react';
import { Button } from './UI';
let Firebase = require('firebase');

class Presenter extends React.Component {

  constructor(props) {
    this.state = {
      activeLectureKey: props.routeParams.lectureId,
      activeQuestionKey: null,
      questions: ['Draw the TCP handshake', 'Draw a HTTP connection', 'Draw a picture of a large bird with dragon wings'],
      responses: []
    };
    for (let i = 0; i < 20; i++) {
      this.state.responses.push({thumbnail: 'http://placehold.it/50x50'});
    }
  }

  onActivateQuestion(key) {
    this.setState({activeQuestionKey: key});
  }

  onThumbnailClick(key) {
    console.log('make a large version of submition '+key);
  }

  render() {

    this.styles = {
      container: {
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: '#eeedff',
      },
      questionPanel: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      },
      heading: {
        display: 'flex',
        background: '#5C42AB',
        padding: 20,
        color: '#DDE0FF',
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
        fontSize: 30,
      },
      question: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 40,
        padding: 20,
        textAlign: 'center',
        lineHeight: '1.3em',
        flexGrow: 1,
      },
      responses: {
        flexGrow: 1,
        borderTop: 'solid 1px #ccc',
      }
    };

    return (
      <div style={this.styles.container}>
        <div style={this.styles.questionPanel}>
          <div style={this.styles.heading}>
            <div style={this.styles.presenterCode}>
              <span style={this.styles.presenterCodeTitle}>CODE</span>
              <span style={this.styles.presenterCodeCode}>b3a</span>
            </div>
            <div style={this.styles.presenterLink}>
              <span>www.uqdraw.com/b3a</span>
            </div>
          </div>
          <div style={this.styles.question}>
            <Question question={this.state.questions[this.state.activeQuestionKey]}/>
          </div>
          <div style={this.styles.responses}>
            <PresenterResponses responses={this.state.responses} onThumbnailClick={this.onThumbnailClick}/>
          </div>
        </div>
        <QuestionSelector questions={this.state.questions} onActivateQuestion={this.onActivateQuestion.bind(this)}/>
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
        flex: '200px 0 0',
        background: '#5C42AB',
        color: '#DDE0FF',
      },
      list: {
      },
      listItem: {
        display: 'flex',
        justifyContent: 'center',
        borderBottom: 'solid 1px #6a46Af',
        padding: '5px 10px',
        cursor: 'pointer',
      }
    };
  }

  onActivateQuestion(key) {
    this.props.onActivateQuestion(key);
  }

  render() {
    let questions = this.props.questions.map((question, key) => {
      return <div style={this.styles.listItem} onClick={this.onActivateQuestion.bind(this, key)}><span>Question {key+1}</span></div>;
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
        fontSize: 24,
        color: '#aaa',
      },
      buttons: {
        fontSize: 18,
      },
    };

    this.state = {
      takingQuestions: false,
    };
  }

  start() {
    this.setState({takingQuestions: true});
    this.refs.timer.startTimer();
  }

  stop() {
    this.setState({takingQuestions: false});
    this.refs.timer.stopTimer();
  }

  render() {
    console.log('rendering');
    if (!this.props.question) {
      return (
        <span style={this.styles.unselected}>
          Select a question on the right when you are ready to begin.
        </span>
      );
    }
    var button;
    if (this.state.takingQuestions) {
      button = <Button key="1" onClick={this.stop.bind(this)}>Stop Taking Responses</Button>;
    } else {
      button = <Button key="2" onClick={this.start.bind(this)}>Start Taking Responses</Button>;
    }
    console.log(button);
    return (
      <div>
        <span>{this.props.question}</span>

        <Timer interval="100" increment="1000" ref="timer"/>
        <div style={this.styles.buttons}>
          {button}
        </div>
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
        <h2>Current Responses</h2>
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
