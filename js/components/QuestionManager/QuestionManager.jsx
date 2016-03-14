import React, { Component } from 'react';
import { Link } from 'react-router';
import Header from '../Header/Header.jsx';
import QuestionList from './QuestionList.jsx';
import LectureComposer from '../LectureComposer/LectureComposer.jsx';
import HorizontalDragScroll from '../../composables/HorizontalDragScroll.js';
import * as QuestionActions from '../../actions/QuestionActions.js';
import * as LectureActions from '../../actions/LectureActions.js';
import * as PresentationActions from '../../actions/PresentationActions.js';
import LectureStore from '../../stores/LectureStore.js';
import { subscribe, unsubscribe, APIConstants } from '../../utils/API.js';
import generateComponentKey from '../../utils/ComponentKey.js';
import Clickable from '../Clickable/Clickable.jsx';
import './QuestionManager.scss';
import archiveIcon from '../../../images/basic_picture_multiple.svg';
import { connect } from 'react-redux';

class QuestionManager extends Component {
  constructor(props) {
    super(props);

    props.fetchLectures(props.location.state.courseId);
    this.state = {
      isLectureModalOpen: false,
    };

    this.onRemoveLecture = this.onRemoveLecture.bind(this);
    this.onAddQuestion = this.onAddQuestion.bind(this);
    this.showLectureModal = this.showLectureModal.bind(this);
    this.hideLectureModal = this.hideLectureModal.bind(this);
    this.onAddLecture = this.onAddLecture.bind(this);
  }

  showLectureModal() {
    this.setState({ isLectureModalOpen: true });
  }

  hideLectureModal() {
    this.setState({ isLectureModalOpen: false });
  }

  onAddLecture(title) {
    this.props.createLecture(this.props.location.state.courseId, title);
    this.setState({ isLectureModalOpen: false });
  }

  onRemoveLecture(lectureId) {
    this.props.deleteLecture(lectureId);
  }

  onAddQuestion(lectureKey, question) {
    const listPosition = this.props.lectures[lectureKey].questions.length;
    this.props.createQuestion(lectureKey, question, listPosition);
  }

  render() {
    const { scrollHandlers, setScrollRef, lectures, questions } = this.props;
    const { courseName } = this.props.params;
    const { isLectureModalOpen } = this.state;

    return (
      <div className='ViewContainer'>
        <Header>
          <Link className='Stack' to='archive'>
            <div className='Stack-iconContainer'>
              <img className='Stack-icon' src={archiveIcon} />
            </div>
            <span className='Stack-label'>Archives</span>
          </Link>
        </Header>

        <div className='QuestionManager' {...scrollHandlers} data-scrollable="true">
          <div className='QustionManager-header' data-scrollable="true">
            <h1>Question Manager - {courseName}</h1>
          </div>

          <div className='QuestionManager-boardContainer'>
            <div className='QuestionManager-board' ref={setScrollRef} data-scrollable="true">
              {lectures && Object.entries(lectures).map(([key, lecture]) => (
                <QuestionList
                  key={key}
                  courseName={courseName}
                  lectureKey={key}
                  lecture={lecture}
                  questions={questions}
                  onRemoveLecture={this.onRemoveLecture}
                  onAddQuestion={this.onAddQuestion}
                  onRemoveQuestion={this.props.deleteQuestion}
                  onLaunchPresentation={this.props.presentationStarted}
                />
              ))}
              <div className="QuestionManager-addLecture" onClick={this.showLectureModal}>
                Add a new lecture...
              </div>
              <span>&nbsp;</span> {/* w/o this add new lecture abuts side */}
            </div>
          </div>

          <LectureComposer
            isOpen={isLectureModalOpen}
            onClose={this.hideLectureModal}
            onSave={this.onAddLecture} />
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    lectures: state.lectures.lectures,
    questions: state.questions.questions,
  }),
  {
    fetchLectures: LectureActions.fetchLectures,
    createLecture: LectureActions.createLecture,
    deleteLecture: LectureActions.deleteLecture,
    createQuestion: QuestionActions.createQuestion,
    deleteQuestion: QuestionActions.deleteQuestion,
    presentationStarted: PresentationActions.presentationStart,
  }
)(HorizontalDragScroll(QuestionManager));
