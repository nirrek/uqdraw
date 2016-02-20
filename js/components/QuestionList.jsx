import React, { Component } from 'react';
import { Link } from 'react-router';
import Question from './Question.jsx';
import QuestionComposer from './QuestionComposer.jsx';
require('../../styles/components/QuestionManager.scss');

export default class QuestionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
    };
  }

  showQuestionModal(event) {
    this.setState({modalIsOpen: true});
    event.preventDefault();
  }

  hideQuestionModal(event) {
    this.setState({modalIsOpen: false});
    event.preventDefault();
  }

  onAddQuestion(lectureKey, lecture, question) {
    this.props.onAddQuestion(lectureKey, lecture, question);
    this.setState({modalIsOpen: false});
    event.preventDefault();
  }

  onRemoveLecture(key) {
    this.props.onRemoveLecture(key);
  }

  onRemoveQuestion(lectureKey, lecture, questionKey) {
    this.props.onRemoveQuestion(lectureKey, lecture, questionKey);
  }

  render() {
    let {courseName, lectureKey, lecture, ...delegateProps} = this.props;
    let questionComponents;
    // Make sure both the lecture questions and lecture question order exist
    if (lecture.questions && lecture.questionOrder) {
      questionComponents = lecture.questionOrder.map((questionKey) => {

        // If a question key is in questionOrder but has no matching question
        if (!lecture.questions.hasOwnProperty(questionKey)) {
          return null;
        }

        let question = lecture.questions[questionKey];
        return (
          <Question
            key={questionKey}
            questionKey={questionKey}
            question={question}
            onRemoveQuestion={this.onRemoveQuestion.bind(this, lectureKey, lecture)}
          />
        );
      });
    }
    return (
      <div className='CardList' draggable="true">
        <div className='CardList-header'>
          <h2>{lecture.title}</h2>
          <div className='PresenterLinkContainer'>
            <Link to={`/${courseName}/${lectureKey}`}>
              Launch {lecture.title} Presentation
            </Link>
          </div>
          <a
            className="Button--close"
            onClick={this.onRemoveLecture.bind(this, lectureKey)}>
            &times;
          </a>
        </div>
        {questionComponents}
        <div className='Card--add' onClick={this.showQuestionModal.bind(this)}>
          Add a new question
        </div>

        <QuestionComposer
          isOpen={this.state.modalIsOpen}
          onClose={this.hideQuestionModal.bind(this)}
          onSave={this.onAddQuestion.bind(this, lectureKey, lecture)}
        />
      </div>
    );
  }
}

QuestionList.propTypes = {
  courseName: React.PropTypes.string,
  lectureKey: React.PropTypes.string,
  lecture: React.PropTypes.object,
  onAddQuestion: React.PropTypes.func,
  onRemoveLecture: React.PropTypes.func,
  onRemoveQuestion: React.PropTypes.func,
};
