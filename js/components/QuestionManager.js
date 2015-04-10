import React from 'react';
import Header from './Header.js';
import { Link } from 'react-router';
import { Button } from './UI';
let Firebase = require('firebase');
let Modal = require('react-modal');

var appElement = document.getElementById('react');
Modal.setAppElement(appElement);
Modal.injectCSS();

// Should have some sort of configuration module for this stuff
const FIREBASE_ROOT = 'https://uqdraw.firebaseio.com';

class QuestionManager extends React.Component {
  constructor(props) {
   super(props);
    this.state = {
      curYPos: 0,
      curXPos: 0,
      curScrollPos: 0,
      curDown: false,
      curOffset: 0,
      isLectureModalOpen: false,
      lectures: {},
      courseId: '-JlUd0xRBkwULfuGFGqo',
    };
  }

  componentDidMount() {
    // Store dom node reference to scrolling div
    this.state.node = React.findDOMNode(this.refs.cardLists);

    let fb = this.fb = new Firebase(`${FIREBASE_ROOT}/lectures/${this.state.courseId}`);
    fb.on('value', (snapshot) => {
      let content = snapshot.val() || {};
      this.setState({lectures: content});
    });
  }

  componentWillUnmount() {
    this.fb.off();
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

  mouseUp(event) {
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
    this.fb.push(newLecture);
    this.setState({isLectureModalOpen: false});
    event.preventDefault();
  }

  onRemoveLecture(lectureId) {
    let lectures = this.state.lectures;
    if (lectures[lectureId]) {
      delete lectures[lectureId];
      this.setState({lectures: lectures});
      this.fb.child(lectureId).remove();
    }
  }

  onAddQuestion(lectureId, question) {
    let lectures = this.state.lectures;
    let lecture = lectures[lectureId];
    lecture.questions ?
      lecture.questions.push(question) :
      lecture.questions = [question];
    this.setState({lectures: lectures});
    this.fb.update(this.state.lectures);
  }

  onRemoveQuestion(lectureId, position) {
    let lectures = this.state.lectures;
    let lecture = lectures[lectureId];
    if (lecture.questions[position] !== undefined) {
      lecture.questions.splice(position, 1);
      this.setState({lectures: lectures});
      this.fb.update(this.state.lectures);
    }
  }

  render() {
    var styles = {
      questionManager: {
        background: '#5C42AB',
        position: 'absolute',
        top: 83,
        right: 0,
        bottom: 0,
        left: 0,
      },
      titleBar: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // background: '#493589',
        color: '#fff',
        WebkitUserSelect: 'none',
      },
      welcomeLink: {
        alignSelf: 'flex-start'
      },
      title: {
        display: 'flex',
        alignItems: 'middle'
      },
      canvas: {
        position: 'relative',
        height: '100%',
      },
      cardLists: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        overflowX: 'auto',
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
      createList: {
        display: 'flex',
        flexDirection: 'column',
        margin: '10px',
        padding: '10px',
        background: 'rgba(0,0,0,.12)',
        borderRadius: '3px',
        width: '270px',
        flex: '0 0 270px',
        marginRight: '10px',
        cursor: 'pointer',
        WebkitUserSelect: 'none',
        color: 'rgba(255,255,255,.7)',
      },
    };

    let lectures = Object.keys(this.state.lectures).map((key) => {
      return (
        <CardList
          courseId={this.props.routeParams.courseId}
          lectureId={key}
          lecture={this.state.lectures[key]}
          onRemoveLecture={this.onRemoveLecture.bind(this)}
          onAddQuestion={this.onAddQuestion.bind(this)}
          onRemoveQuestion={this.onRemoveQuestion.bind(this)}
        />
      );
    });

    return (
      <div>
        <Header/>
        <div className='QuestionManager' style={styles.questionManager} onMouseDown={this.mouseDown.bind(this)} onMouseUp={this.mouseUp.bind(this)} onMouseMove={this.mouseMove.bind(this)} data-scrollable="true">
          <div className='TitleBar' style={styles.titleBar} data-scrollable="true">
            <Link to="app" className="TitleBar-link" style={styles.welcomeLink}>Welcome</Link>
            <div className="TitleBar-title" style={styles.title}>
              <h1>Question Manager - {this.props.routeParams.courseId}</h1>
            </div>
          </div>
          <div style={styles.canvas}>
            <div className='CardLists scrollbar' style={styles.cardLists} ref="cardLists" data-scrollable="true">
              {lectures}
              <div style={styles.createList} onClick={this.showLectureModal.bind(this)}>
                <span>Add a new lecture...</span>
              </div>
            </div>
          </div>
          <LectureComposer
            isOpen={this.state.isLectureModalOpen}
            onClose={this.hideLectureModal.bind(this)}
            onSave={this.onAddLecture.bind(this)}
          />
        </div>
      </div>
    );
  }
}

class CardList extends React.Component {

  constructor() {
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
    var styles = {
      card: {
        background: '#fff',
        borderRadius: '3px',
        borderBottom: '1px solid #ccc',
        marginBottom: '6px',
        cursor: 'pointer',
        minHeight: '20px',
        color: '#4d4d4d',
        lineHeight: '18px',
        padding: '6px 8px 4px',
      },
      cardList: {
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #eee',
        margin: '10px',
        padding: '10px',
        background: '#efefef',
        borderRadius: '3px',
        width: '270px',
        flex: '0 0 270px',
        marginRight: '10px',
      },
      titleBar: {
        display: 'flex',
        justifyContent: 'space-between',
      },
      title: {
        margin: '0 0 5px 0',
      },
      add: {
        marginTop: '12px',
        cursor: 'pointer',
        minHeight: '20px',
        color: '#999',
        lineHeight: '18px',
        padding: '6px 8px 4px',
      },
      closeButton: {
        width: 15,
        height: 15,
        flex: '15px 0 0',
        padding: 0,
        alignSelf: 'flex-start',
        fontSize: 22,
        color: '#aaa',
      },
    };

    let questions;
    if (this.props.lecture.questions) {
      questions = this.props.lecture.questions.map((question, id) => {
        return (
          <Card
            lectureId={this.props.lectureId}
            questionId={id}
            question={question}
            onRemoveQuestion={this.props.onRemoveQuestion}
          />
        );
      });
    }

    return (
      <div className='CardList' style={styles.cardList} draggable="true">
        <div style={styles.titleBar}>
          <h2 style={styles.title}>{this.props.lecture.title}</h2>
          <Link to="presenter" params={{courseId: this.props.courseId, lectureId: this.props.lectureId}}>P</Link>
          <a
            className=""
            onClick={this.onRemoveLecture.bind(this)}
            data-id={this.props.lectureId}
            style={styles.closeButton}>
            &times;
          </a>
        </div>
        {questions}
        <div onClick={this.showQuestionModal.bind(this)} style={styles.add}>Add a new question</div>

        <QuestionComposer
          isOpen={this.state.modalIsOpen}
          onClose={this.hideQuestionModal.bind(this)}
          onSave={this.onAddQuestion.bind(this)}
        />
      </div>
    );
  }
}

class LectureComposer extends React.Component {
  constructor() {
    this.state = {
      lecture: '',
      inputHasText: false,
    };
  }

  onInputChange(event) {
    let inputText = event.target.value;
    let inputHasText = true;
    if (inputText.length === 0) {inputHasText = false;}
    this.setState({
      lecture: inputText,
      inputHasText: inputHasText
    });
  }

  onSave() {
    this.props.onSave(this.state.lecture);
    this.setState({lecture: '', inputHasText: false});
  }

  render() {
    let labelClass = 'TransparentLabel';
    if (this.state.inputHasText) {labelClass += ' TransparentLabel--hidden'; }

    return (
      <Modal isOpen={this.props.isOpen} className='Modal--lectureComposer'>
        <a onClick={this.props.onClose} href="#" className='Modal__cross'>&times;</a>
        <div className='AdvancedInput'>
          <div className={labelClass}>Enter Lecture Name Here</div>
          <input type="text" value={this.state.lecture} onChange={this.onInputChange.bind(this)}/>
        </div>
        <div className='Modal__footer'>
          <Button type="submit" onClick={this.onSave.bind(this)}>Add Lecture</Button>
        </div>
      </Modal>
    );
  }
}

// A component that allows a lecturer to compose a new question, or to edit
// and existing one.
class QuestionComposer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: ''
    };
  }

  onTextareaChange(event) {
    let inputText = event.target.value;
    let inputHasText = true;
    if (inputText.length === 0) { inputHasText = false; }
    this.setState({
      question: event.target.value,
      inputHasText: inputHasText,
    });
  }

  onSave() {
    this.props.onSave(this.state.question);
    this.setState({question: '', inputHasText: false});
  }

  render() {
    let labelClass = 'TransparentLabel';
    if (this.state.inputHasText) {labelClass += ' TransparentLabel--hidden'; }

    return (
      <Modal className='Modal--questionComposer' isOpen={this.props.isOpen}>
        <a onClick={this.props.onClose} href="#" className='Modal__cross'>&times;</a>
        <div className='AdvancedInput'>
          <div className={labelClass}>Enter Question Here</div>
          <textarea onChange={this.onTextareaChange.bind(this)} value={this.state.question} />
        </div>
        <a href="#">Insert supporting image &rarr;</a>
        <div className='Modal__footer'>
          <Button onClick={this.onSave.bind(this)}>Save Question</Button>
        </div>
      </Modal>
    );
  }
}

class Card extends React.Component {
  constructor() {
    this.styles = {
      card: {
        display: 'flex',
        justifyContent: 'space-between',
        flexGrow: '1',
        background: '#fff',
        borderRadius: '3px',
        borderBottom: '1px solid #ccc',
        marginBottom: '6px',
        cursor: 'pointer',
        minHeight: '20px',
        color: '#4d4d4d',
        lineHeight: '18px',
        padding: '6px 8px 4px',
      },
      content: {
        flexGrow: 0,
      },
      closeButton: {
        width: 15,
        height: 15,
        flex: '15px 0 0',
        padding: 0,
        alignSelf: 'flex-start',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        color: '#aaa',
      }
    };
  }

  onRemoveQuestion(event) {
    this.props.onRemoveQuestion(this.props.lectureId, event.currentTarget.dataset.id);
  }

  render() {
    return (
      <div className="Card" style={this.styles.card} draggable="true">
        <span style={this.styles.content}>{this.props.question}</span>
        <a
          className=""
          onClick={this.onRemoveQuestion.bind(this)}
          data-id={this.props.questionId}
          style={this.styles.closeButton}>
          &times;
        </a>
      </div>
    );
  }
}

export default QuestionManager;
