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

  onRemoveLecture(key) {
    this.props.onRemoveLecture(key);
  }

  render() {
    let {courseName, lectureId, lecture, questions, ...props} = this.props;
    let questionComponents;
    // Make sure both the lecture question refs and matching questions exist
    if (lecture.questions && questions) {
      questionComponents = lecture.questions.map((id) => {

        // If the lecture question ref exists but there is no matching question
        if (!questions.hasOwnProperty(id)) {
          return null;
        }

        let question = questions[id];
        return (
          <Question
            key={id}
            lectureId={lectureId}
            questionId={id}
            question={question}
            {...props}
          />
        );
      });
    }
    return (
      <div className='CardList' draggable="true">
        <div className='CardList-header'>
          <h2>{lecture.title}</h2>
          <div className='PresenterLinkContainer'>
            <Link to="presenter" params={{courseName: courseName, lectureId: lectureId}}>Launch {lecture.title} Presentation</Link>
          </div>
          <a
            className="Button--close"
            onClick={this.onRemoveLecture.bind(this, lectureId)}>
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
          onSave={this.onAddQuestion.bind(this)}
        />
      </div>
    );
  }
}

QuestionList.propTypes = {
  courseName: React.PropTypes.string,
  lectureId: React.PropTypes.string,
  lecture: React.PropTypes.object,
  questions: React.PropTypes.object,
  onAddQuestion: React.PropTypes.func,
  onRemoveLecture: React.PropTypes.func,
};

export default QuestionList;
