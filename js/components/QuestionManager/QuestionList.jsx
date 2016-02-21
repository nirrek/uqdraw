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

  addQuestion(lectureKey, lecture, question) {
    this.props.onAddQuestion(lectureKey, lecture, question);
    this.setState({ modalIsOpen: false });
  }

  removeQuestion(lectureKey, lecture) {
    return (questionKey) => {
      this.props.onRemoveQuestion(lectureKey, lecture, questionKey);
    }
  }

  render() {
    let { courseName, lectureKey, lecture, ...delegateProps } = this.props;

    let renderedQuestions;
    if (lecture.questions && lecture.questionOrder) {
      const removeQuestion = this.removeQuestion(lectureKey, lecture);

      renderedQuestions = lecture.questionOrder.map(questionKey => (
        <Card key={questionKey} onClose={() => removeQuestion(questionKey)}>
          {lecture.questions[questionKey]}
        </Card>
      ));
    }

    return (
      <div className='QuestionList' draggable="true">
        <div className='QuestionList-header'>
          <h2 className='QuestionList-heading'>{lecture.title}</h2>
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
          onSave={this.addQuestion.bind(this, lectureKey, lecture)} />

        <div className='QuestionList-present'>
          <Link to={`/${courseName}/${lectureKey}`}
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
  onAddQuestion: PropTypes.func,
  onRemoveLecture: PropTypes.func,
  onRemoveQuestion: PropTypes.func,
};
