import React from 'react';
require('../../css/components/QuestionManager.scss');

class Question extends React.Component {

  onRemoveQuestion(event) {
    this.props.onRemoveQuestion(this.props.lectureId, event.currentTarget.dataset.id);
  }

  render() {
    return (
      <div className="Card" draggable="true">
        <span>{this.props.question}</span>
        <a
          className="Button--close"
          onClick={this.onRemoveQuestion.bind(this)}
          data-id={this.props.questionId}>
          &times;
        </a>
      </div>
    );
  }
}

export default Question;
