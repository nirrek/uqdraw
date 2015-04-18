import React from 'react';
import { Link } from 'react-router';
import Question from './Question';
import QuestionComposer from './QuestionComposer';
require('../../css/components/QuestionManager.scss');

class QuestionList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
    };
  }

  showQuestionModal() {
    this.setState({modalIsOpen: true});
    event.preventDefault();
  }

  hideQuestionModal() {
    this.setState({modalIsOpen: false});
    event.preventDefault();
  }

  onAddQuestion(question) {
    this.props.onAddQuestion(this.props.lectureId, question);
    this.setState({modalIsOpen: false});
    event.preventDefault();
  }

  onRemoveLecture(event) {
    this.props.onRemoveLecture(event.currentTarget.dataset.id);
  }

  render() {
    let questions;
    // Make sure both the lecture question refs and matching questions exist
    if (this.props.lecture.questions && this.props.questions) {
      questions = this.props.lecture.questions.map((id) => {

        // If the lecture question ref exists but there is no matching question
        if (!this.props.questions.hasOwnProperty(id)) {
          return null;
        }

        let question = this.props.questions[id];
        return (
          <Question
            key={id}
            lectureId={this.props.lectureId}
            questionId={id}
            question={question}
            onRemoveQuestion={this.props.onRemoveQuestion}
          />
        );
      });
    }
    return (
      <div className='CardList' draggable="true">
        <div className='CardList-header'>
          <h2>{this.props.lecture.title}</h2>
          <div className='PresenterLinkContainer'>
            <Link to="presenter" params={{courseName: this.props.courseName, lectureId: this.props.lectureId}}>Launch {this.props.lecture.title} Presentation</Link>
          </div>
          <a
            className="Button--close"
            onClick={this.onRemoveLecture.bind(this)}
            data-id={this.props.lectureId}>
            &times;
          </a>
        </div>
        {questions}
        <div className='Card--add' onClick={this.showQuestionModal.bind(this)}>
          Add a new question
        </div>

        <QuestionComposer
          isOpen={this.state.modalIsOpen}
          onClose={this.hideQuestionModal.bind(this)}
          onSave={this.onAddQuestion.bind(this)}
        />
      </div>
    );
  }
}

export default QuestionList;
