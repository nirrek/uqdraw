import React, { Component } from 'react';
import { Link } from 'react-router';
import Header from './Header/Header.jsx';
import QuestionList from './QuestionList.jsx';
import LectureComposer from './LectureComposer/LectureComposer.jsx';
import HorizontalDragScroll from '../composables/HorizontalDragScroll.js';
import { createQuestion, deleteQuestion } from '../actions/QuestionActions.js';
import { createLecture, deleteLecture } from '../actions/LectureActions.js';
import LectureStore from '../stores/LectureStore.js';
import { subscribe, unsubscribe, APIConstants } from '../utils/API.js';
import generateComponentKey from '../utils/ComponentKey.js';
import '../../styles/components/Colors.scss';
import '../../styles/components/QuestionManager.scss';

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
  }

  componentDidMount() {
    // Listen for store changes
    LectureStore.addChangeListener(this.onLectureChange);

    // Initialise store data
    this.initData(this.props.courseId);
  }

  componentWillReceiveProps(newProps) {
    // Initialise store data
    this.initData(newProps.courseId);
  }

  componentWillUnmount() {
    LectureStore.removeChangeListener(this.onLectureChange);
    unsubscribe(APIConstants.lectures, this.componentKey, this.props.courseId);
  }

  initData(courseKey) {
    if (courseKey) {
      this.setState({lectures: LectureStore.getAll(courseKey)});
      subscribe(APIConstants.lectures, this.componentKey, courseKey);
    }
  }

  onLectureChange() {
    this.setState({lectures: LectureStore.getAll(this.props.courseId)});
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
    createLecture(this.props.courseId, title);
    this.setState({isLectureModalOpen: false});
    event.preventDefault();
  }

  onRemoveLecture(lectureId) {
    deleteLecture(this.props.courseId, lectureId);
  }

  onAddQuestion(lectureKey, lecture, question) {
    createQuestion(this.props.courseId, lectureKey, lecture, question);
    event.preventDefault();
  }

  onRemoveQuestion(lectureKey, lecture, questionKey) {
    deleteQuestion(this.props.courseId, lectureKey, lecture, questionKey);
    event.preventDefault();
  }

  render() {
    let lectures;
    if (this.state.lectures) {
      lectures = Object.keys(this.state.lectures).map((lectureKey) => {
        return (
          <QuestionList
            key={lectureKey}
            courseName={this.props.courseName}
            lectureKey={lectureKey}
            lecture={this.state.lectures[lectureKey]}
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
            <div className='Stack-iconContainer'>
              <img className='Stack-icon' src={require('../../images/basic_picture_multiple.svg')} />
            </div>
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
