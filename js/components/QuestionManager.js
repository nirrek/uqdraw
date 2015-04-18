import React from 'react';
import config from '../config';
import Header from './Header';
import { Link } from 'react-router';
import QuestionList from './QuestionList';
import LectureComposer from './LectureComposer';

let Firebase = require('firebase');
let Modal = require('react-modal');

require('../../css/components/Colors.scss');
require('../../css/components/QuestionManager.scss');

var appElement = document.getElementById('react');
Modal.setAppElement(appElement);
Modal.injectCSS();

class QuestionManager extends React.Component {
  constructor(props) {
    props.onChangeCourse(null, props.routeParams.courseName);
   super(props);
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

    this.getLectures = this.getLectures.bind(this);
    this.getquestions = this.getQuestions.bind(this);
  }

  componentDidMount() {
    // Store dom node reference to scrolling div
    this.state.node = React.findDOMNode(this.refs.cardLists);

    if (this.props.courseId) {
      this.getLectures(this.props.courseId);
      this.getquestions(this.props.courseId);
    }
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.courseId) {
      if (newProps.courseId) {
        this.getLectures(newProps.courseId);
        this.getquestions(newProps.courseId);
      }
    }
  }

  componentWillUnmount() {
    this.lecturesRef.off();
  }

  getLectures(courseId) {
    this.lecturesRef = new Firebase(`${config.firebase.base}/lectures/${courseId}`);
    this.lecturesRef.on('value', (snapshot) => {
      let content = snapshot.val() || {};
      this.setState({lectures: content});
    });
  }

  getQuestions(courseId) {
    this.questionsRef = new Firebase(`${config.firebase.base}/questions/${courseId}`);
    this.questionsRef.on('value', (snapshot) => {
      let content = snapshot.val() || {};
      this.setState({questions: content});
    });
  }

  mouseMove(event) {
    if (this.state.curDown === true) {
      var node = this.state.node,
          offset = this.state.curXPos - event.pageX,
          scrollLeft = node.scrollLeft,
          maxScroll = node.scrollWidth - node.clientWidth;

      // Stop measuring negative offsets once scroll is 0
      // This avoids buffering up scroll left distance if you keep dragging
      // past the minimum scroll value
      if (scrollLeft <= 0 && offset < 0) {
        this.state.curScrollPos = 0;
        this.state.curXPos = event.pageX;
      }

      // Stop measuring positive offsets once max scroll is reached
      // This avoids buffering up scroll right distance if you keep dragging
      // past the maximum scroll value
      else if (scrollLeft >= maxScroll && offset > 0) {
        this.state.curScrollPos = maxScroll;
        this.state.curXPos = event.pageX;
      }

      node.scrollLeft = this.state.curScrollPos + offset;
    }
  }

  mouseDown(event) {
    if (event.target.dataset.scrollable) {
      this.state.curDown = true;
      this.state.curXPos = event.pageX;
      this.state.curScrollPos = this.state.node.scrollLeft;
    }
  }

  mouseUp() {
    this.state.curDown = false;
  }

  showLectureModal(event) {
    this.setState({isLectureModalOpen: true});
    event.preventDefault();
  }

  hideLectureModal(event) {
    this.setState({isLectureModalOpen: false});
    event.preventDefault();
  }

  onAddLecture(lecture) {
    let newLecture = {title: lecture, questions: {}};
    this.lecturesRef.push(newLecture);
    this.setState({isLectureModalOpen: false});
    event.preventDefault();
  }

  onRemoveLecture(lectureId) {
    let lectures = this.state.lectures;
    if (lectures[lectureId]) {
      delete lectures[lectureId];
      this.setState({lectures: lectures});
      this.lecturesRef.child(lectureId).remove();
    }
  }

  onAddQuestion(lectureId, question) {
    // Add new question to questions bucket
    let questionRef = this.questionsRef.push(question);
    let lecture = this.state.lectures[lectureId];
    // Set current lecture questions to an array if its undefined
    lecture.questions = lecture.questions || [];
    lecture.questions.push(questionRef.key());
    this.lecturesRef.child(lectureId).update(lecture);
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
      this.lecturesRef.update(this.state.lectures);
      this.questionsRef.child(questionId).remove();
    }
  }

  render() {

    let lectures = Object.keys(this.state.lectures).map((key) => {
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

    return (
      <div className='ViewContainer'>
        <Header>
          <div className='Stack'>
            <img className='Stack-icon' src='/images/basic_picture_multiple.svg' />
            <Link to='archive' className='Stack-label'>Archives</Link>
          </div>
        </Header>
        <div className='QuestionManager' onMouseDown={this.mouseDown.bind(this)} onMouseUp={this.mouseUp.bind(this)} onMouseMove={this.mouseMove.bind(this)} data-scrollable="true">
          <div className='QustionManager-header' data-scrollable="true">
            <div className="TitleBar-title">
              <h1>Question Manager - {this.props.courseName}</h1>
            </div>
          </div>
          <div className='CardListsContainer'>
            <div className='CardLists scrollbar' ref="cardLists" data-scrollable="true">
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

export default QuestionManager;
