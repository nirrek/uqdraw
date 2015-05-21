import React from 'react';
import config from '../config';
import Header from './Header';
import { Link } from 'react-router';
import QuestionList from './QuestionList';
import LectureComposer from './LectureComposer';
import HorizontalDragScroll from '../composables/HorizontalDragScroll.js';

import QuestionActions from '../actions/QuestionActions.js';
import QuestionStore from '../stores/QuestionStore.js';
import LectureActions from '../actions/LectureActions.js';
import LectureStore from '../stores/LectureStore.js';
import API, {APIConstants} from '../utils/API.js';
import ComponentKey from '../utils/ComponentKey.js';

let Firebase = require('firebase');
let Modal = require('react-modal');

require('../../css/components/Colors.scss');
require('../../css/components/QuestionManager.scss');

var appElement = document.getElementById('react');
Modal.setAppElement(appElement);
Modal.injectCSS();

class QuestionManager extends React.Component {
  constructor(props) {
    super(props);
    props.onChangeCourse(null, props.routeParams.courseName);
    this.componentKey = ComponentKey.generate();
    this.state = {
      curYPos: 0,
      curXPos: 0,
      curScrollPos: 0,
      curDown: false,
      curOffset: 0,
      isLectureModalOpen: false,
      lectures: {},
      questions: {},
    };

    this.initData = this.initData.bind(this);
    this.onLectureChange = this.onLectureChange.bind(this);
    this.onQuestionChange = this.onQuestionChange.bind(this);
  }

  componentDidMount() {
    // Listen for store changes
    LectureStore.addChangeListener(this.onLectureChange);
    QuestionStore.addChangeListener(this.onQuestionChange);

    // Initialise store data
    this.initData(this.props.courseId);
  }

  componentWillReceiveProps(newProps) {
    // Initialise store data
    this.initData(newProps.courseId);
  }

  componentWillUnmount() {
    LectureStore.removeChangeListener(this.onLectureChange);
    QuestionStore.removeChangeListener(this.onQuestionChange);
    API.unsubscribe(APIConstants.lectures, this.componentKey, this.props.courseId);
    API.unsubscribe(APIConstants.questions, this.componentKey, this.props.courseId);
  }

  initData(courseKey) {
    if (courseKey) {
      this.setState({lectures: LectureStore.getAll(courseKey)});
      this.setState({questions: QuestionStore.getAll(courseKey)});
      API.subscribe(APIConstants.lectures, this.componentKey, courseKey);
      API.subscribe(APIConstants.questions, this.componentKey, courseKey);
    }
  }

  onLectureChange() {
    this.setState({lectures: LectureStore.getAll(this.props.courseId)});
  }

  onQuestionChange() {
    this.setState({questions: QuestionStore.getAll(this.props.courseId)});
  }

  showLectureModal(event) {
    this.setState({isLectureModalOpen: true});
    event.preventDefault();
  }

  hideLectureModal(event) {
    this.setState({isLectureModalOpen: false});
    event.preventDefault();
  }

  onAddLecture(title) {
    LectureActions.create(this.props.courseId, title);
    this.setState({isLectureModalOpen: false});
    event.preventDefault();
  }

  onRemoveLecture(lectureId) {
    LectureActions.delete(this.props.courseId, lectureId);
  }

  onAddQuestion(lectureId, question) {
    // Add new question to questions bucket
    let questionRef = API.addToQuestions(this.props.courseId, question);

    // Lecture needs to store a reference to the question we just added
    let lecture = this.state.lectures[lectureId];
    lecture.questions = lecture.questions || [];
    lecture.questions.push(questionRef.key());
    API.updateLecture(this.props.courseId, lectureId, lecture);
  }

  onRemoveQuestion(lectureId, questionId) {
    let lectures = this.state.lectures;
    let lecture = lectures[lectureId];
    let questions = this.state.questions;
    let position = lecture.questions.indexOf(questionId);
    if (position > -1) {
      lecture.questions.splice(position, 1);
      delete questions[questionId];
      this.setState({lectures: lectures, questions: questions});
      API.removeQuestion(this.props.courseId, lectures, questionId);
    }
  }

  render() {
    let lectures;
    if (this.state.lectures) {
      lectures = Object.keys(this.state.lectures).map((key) => {
        return (
          <QuestionList
            key={key}
            courseName={this.props.courseName}
            lectureId={key}
            lecture={this.state.lectures[key]}
            questions={this.state.questions}
            onRemoveLecture={this.onRemoveLecture.bind(this)}
            onAddQuestion={this.onAddQuestion.bind(this)}
            onRemoveQuestion={this.onRemoveQuestion.bind(this)}
          />
        );
      });
    }

    return (
      <div className='ViewContainer'>
        <Header>
          <div className='Stack'>
            <img className='Stack-icon' src='/images/basic_picture_multiple.svg' />
            <Link to='archive' className='Stack-label'>Archives</Link>
          </div>
        </Header>
        <div className='QuestionManager' {...this.props.scrollHandlers} data-scrollable="true">
          <div className='QustionManager-header' data-scrollable="true">
            <div className="TitleBar-title">
              <h1>Question Manager - {this.props.courseName}</h1>
            </div>
          </div>
          <div className='CardListsContainer'>
            <div className='CardLists scrollbar' ref={this.props.setScrollRef} data-scrollable="true">
              {lectures}
              <div className="CardList--add" onClick={this.showLectureModal.bind(this)}>
                <span>Add a new lecture...</span>
              </div>
            {/* side scroll does not respect right margin of rightmost object without this */
            <div>&nbsp;</div> }
            </div>
          </div>
          <LectureComposer
            isOpen={this.state.isLectureModalOpen}
            onClose={this.hideLectureModal.bind(this)}
            onSave={this.onAddLecture.bind(this)}
          />
        </div>
        {/* Quick hack so that the scrollbar isnt sitting on bottom */}
        <div className='QuestionManagerFooter' />
      </div>
    );
  }
}

export default HorizontalDragScroll(QuestionManager);
