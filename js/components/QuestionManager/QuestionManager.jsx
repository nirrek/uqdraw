import React, { Component } from 'react';
import { Link } from 'react-router';
import Header from '../Header/Header.jsx';
import QuestionList from './QuestionList.jsx';
import LectureComposer from '../LectureComposer/LectureComposer.jsx';
import HorizontalDragScroll from '../../composables/HorizontalDragScroll.js';
import { createQuestion, deleteQuestion } from '../../actions/QuestionActions.js';
import { createLecture, deleteLecture } from '../../actions/LectureActions.js';
import LectureStore from '../../stores/LectureStore.js';
import { subscribe, unsubscribe, APIConstants } from '../../utils/API.js';
import generateComponentKey from '../../utils/ComponentKey.js';
import Clickable from '../Clickable/Clickable.jsx';
import './QuestionManager.scss';
import archiveIcon from '../../../images/basic_picture_multiple.svg';

class QuestionManager extends Component {
  constructor(props) {
    super(props);
    props.onChangeCourse(null, props.routeParams.courseName);
    this.componentKey = generateComponentKey();

    this.state = {
      curYPos: 0,
      curXPos: 0,
      curScrollPos: 0,
      curDown: false,
      curOffset: 0,
      isLectureModalOpen: false,
      lectures: {},
    };

    this.initData = this.initData.bind(this);
    this.onLectureChange = this.onLectureChange.bind(this);
    this.onRemoveLecture = this.onRemoveLecture.bind(this);
    this.onAddQuestion = this.onAddQuestion.bind(this);
    this.onRemoveQuestion = this.onRemoveQuestion.bind(this);
    this.showLectureModal = this.showLectureModal.bind(this);
    this.hideLectureModal = this.hideLectureModal.bind(this);
    this.onAddLecture = this.onAddLecture.bind(this);
  }

  componentDidMount() {
    LectureStore.addChangeListener(this.onLectureChange);
    this.initData(this.props.courseId);
  }

  componentWillReceiveProps(newProps) {
    this.initData(newProps.courseId);
  }

  componentWillUnmount() {
    LectureStore.removeChangeListener(this.onLectureChange);
    unsubscribe(APIConstants.lectures, this.componentKey, this.props.courseId);
  }

  initData(courseKey) {
    if (courseKey) {
      this.setState({ lectures: LectureStore.getAll(courseKey) });
      subscribe(APIConstants.lectures, this.componentKey, courseKey);
    }
  }

  onLectureChange() {
    this.setState({ lectures: LectureStore.getAll(this.props.courseId) });
  }

  showLectureModal() {
    this.setState({ isLectureModalOpen: true });
  }

  hideLectureModal() {
    this.setState({ isLectureModalOpen: false });
  }

  onAddLecture(title) {
    createLecture(this.props.courseId, title);
    this.setState({ isLectureModalOpen: false });
  }

  onRemoveLecture(lectureId) {
    deleteLecture(this.props.courseId, lectureId);
  }

  onAddQuestion(lectureKey, lecture, question) {
    createQuestion(this.props.courseId, lectureKey, lecture, question);
  }

  onRemoveQuestion(lectureKey, lecture, questionKey) {
    deleteQuestion(this.props.courseId, lectureKey, lecture, questionKey);
  }

  render() {
    const { courseName, scrollHandlers, setScrollRef } = this.props;
    const { lectures, isLectureModalOpen } = this.state;

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
                  onRemoveLecture={this.onRemoveLecture}
                  onAddQuestion={this.onAddQuestion}
                  onRemoveQuestion={this.onRemoveQuestion}
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

export default HorizontalDragScroll(QuestionManager);
