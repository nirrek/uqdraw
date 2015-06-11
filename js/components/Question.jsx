import React from 'react';
require('../../css/components/QuestionManager.scss');

class Question extends React.Component {

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

export default Question;
