import React from 'react';
require('../../css/components/QuestionManager.scss');

class Question extends React.Component {

  onRemoveQuestion(event) {
    this.props.onRemoveQuestion(this.props.lectureId, event.currentTarget.dataset.id);
  }

  render() {
    let {question, questionId} = this.props;
    return (
      <div className="Card" draggable="true">
        <span>{question}</span>
        <a
          className="Button--close"
          onClick={this.onRemoveQuestion.bind(this)}
          data-id={questionId}>
          &times;
        </a>
      </div>
    );
  }
}

Question.propTypes = {
  question: React.PropTypes.string,
  questionId: React.PropTypes.string,
};

export default Question;
