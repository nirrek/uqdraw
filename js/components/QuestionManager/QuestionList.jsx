import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import QuestionComposer from './QuestionComposer.jsx';
import Card from './Card.jsx';
import Clickable from '../Clickable/Clickable.jsx';
import './QuestionList.scss';

export default class QuestionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
    };

    this.showQuestionModal = this.showQuestionModal.bind(this);
    this.hideQuestionModal = this.hideQuestionModal.bind(this);
  }

  showQuestionModal() {
    this.setState({ modalIsOpen: true });
  }

  hideQuestionModal() {
    this.setState({ modalIsOpen: false });
  }

  addQuestion(lectureKey, question) {
    this.props.onAddQuestion(lectureKey, question);
    this.setState({ modalIsOpen: false });
  }

  render() {
    let {
      courseName,
      lectureKey,
      lecture,
      questions,
      onLaunchPresentation,
      ...delegateProps
    } = this.props;

    let renderedQuestions;
    if (lecture.questions) {
      renderedQuestions = lecture.questions.map(questionId => (
        <Card key={questionId} onClose={() => this.props.onRemoveQuestion(questionId)}>
          {questions[questionId].text}
        </Card>
      ));
    }

    return (
      <div className='QuestionList' draggable="true">
        <div className='QuestionList-header'>

          <h2 className='QuestionList-heading'>{lecture.name}</h2>
          <Clickable className='QuestionList-deleteList'
            onClick={this.props.onRemoveLecture.bind(null, lectureKey)}>
            &times;
          </Clickable>
        </div>

        {renderedQuestions}

        <Clickable className='QuestionLlist-addQuestion'
          onClick={this.showQuestionModal}>
          Add a new question
        </Clickable>

        <QuestionComposer
          isOpen={this.state.modalIsOpen}
          onClose={this.hideQuestionModal}
          onSave={this.addQuestion.bind(this, lectureKey)} />

        <div className='QuestionList-present'>
          <Link
            to={`/${courseName}/${lectureKey}`}
            onClick={() => {
              console.log(onLaunchPresentation);
              console.log(lectureKey);
              onLaunchPresentation(lectureKey)
            }}
            className='QuestionList-presentLink'>
            Launch {lecture.title} Presentation
          </Link>
        </div>
      </div>
    );
  }
}

QuestionList.propTypes = {
  courseName: PropTypes.string,
  lectureKey: PropTypes.string,
  lecture: PropTypes.object,
  questions: PropTypes.object,
  onAddQuestion: PropTypes.func,
  onRemoveLecture: PropTypes.func,
  onRemoveQuestion: PropTypes.func,
  onLaunchPresentation: PropTypes.func,
};
