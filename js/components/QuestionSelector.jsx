import React, { Component } from 'react';

export default class QuestionSelector extends Component {

  constructor(props) {
    super(props);
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

  onActivateQuestion(key) {
    this.props.onActivateQuestion(key);
  }

  render() {
    let questions = this.props.questions.map((question, index) => {
      let className = 'PresenterListItem';
      if (question.key === this.props.activeQuestionKey) {
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
