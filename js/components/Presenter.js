import React from 'react';
let Firebase = require('firebase');

class Presenter extends React.Component {

  constructor() {
    this.styles = {
      container: {
        display: 'flex',
        flexDirection: 'row',
      },
      questionSelector: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flex: '200px, 0, 0',
      },
    };
  }

  render() {
    return (
      <div style={this.styles.container}>
        <div>
          <div>
            <span>b3a www.uqdraw.com/b3a</span>
            <span>Draw the TCP handshake</span>
          </div>
          <PresenterResponses/>
        </div>
        <QuestionSelector/>
      </div>
    );
  }
}

class QuestionSelector extends React.Component {
  render() {
    return (
      <p>questionSelector</p>
    );
  }
}

class PresenterResponses extends React.Component {
  render() {
    return (
      <p>presenter responses</p>
    );
  }
}

export default Presenter;
