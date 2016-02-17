import React, { Component } from 'react';
require('../../css/components/QuestionManager.scss');

export default class Question extends Component {

  onRemoveQuestion(questionKey) {
    this.props.onRemoveQuestion(questionKey);
  }

  render() {
    const {questionKey, question} = this.props;
    return (
      <div className="Card" draggable="true">
        <span>{question}</span>
        <a
          className="Button--close"
          onClick={this.onRemoveQuestion.bind(this, questionKey)}>
          &times;
        </a>
      </div>
    );
  }
}

Question.propTypes = {
  questionKey: React.PropTypes.string,
  question: React.PropTypes.string,
  onRemoveQuestion: React.PropTypes.func,
};
