import React from 'react';
import { Link } from 'react-router';
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
      modalIsOpen: false,
      questionSets: {},
      newQuestionSetTitle: '',
      courseId: '-JlUd0xRBkwULfuGFGqo',
    };
  }

  componentDidMount() {
    // Store dom node reference to scrolling div
    this.state.node = React.findDOMNode(this.refs.cardLists);

    let fb = this.fb = new Firebase(`${FIREBASE_ROOT}/questionSets/${this.state.courseId}`);
    fb.on('value', (snapshot) => {
      let content = snapshot.val() || {};
      this.setState({questionSets: content});
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

  showQuestionSetForm(event) {
    this.setState({modalIsOpen: true});
    event.preventDefault();
  }

  hideQuestionSetForm(event) {
    this.setState({modalIsOpen: false});
    event.preventDefault();
  }

  onQuestionSetInputChange(event) {
    this.setState({newQuestionSetTitle: event.target.value});
  }

  addNewQuestionSet(event) {
    // let questionSets = this.state.questionSets;
    let newQuestionSet = {title: this.state.newQuestionSetTitle, questions: {}};
    this.fb.push(newQuestionSet);
    // questionSets.temp = newQuestionSet;
    this.setState({modalIsOpen: false, newQuestionSetTitle: ''});
    event.preventDefault();
  }

  addNewQuestion(questionSetKey, question) {
    let questionSets = this.state.questionSets;
    let questionSet = questionSets[questionSetKey];
    questionSet.questions ?
      questionSet.questions.push(question) :
      questionSet.questions = [question];
    this.setState({questionSets: questionSets});
    this.fb.update(this.state.questionSets);
  }

  onRemoveQuestion(questionSetKey, position) {
    let questionSets = this.state.questionSets;
    let questionSet = questionSets[questionSetKey];
    if (questionSet.questions[position] !== undefined) {
      questionSet.questions.splice(position, 1);
      this.setState({questionSets: questionSets});
      this.fb.update(this.state.questionSets);
    }
  }

  render() {
    var styles = {
      questionManager: {
        background: '#5C42AB',
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
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

    let questionSets = Object.keys(this.state.questionSets).map((key) => {
      return (
        <CardList
          questionSetKey={key}
          questionSet={this.state.questionSets[key]}
          onAddQuestion={this.addNewQuestion.bind(this)}
          onRemoveQuestion={this.onRemoveQuestion.bind(this)}
        />
      );
    });

    return (
      <div className='QuestionManager' style={styles.questionManager} onMouseDown={this.mouseDown.bind(this)} onMouseUp={this.mouseUp.bind(this)} onMouseMove={this.mouseMove.bind(this)} data-scrollable="true">
        <div className='TitleBar' style={styles.titleBar} data-scrollable="true">
          <Link to="app" className="TitleBar-link" style={styles.welcomeLink}>Welcome</Link>
          <div className="TitleBar-title" style={styles.title}>
            <h1>Question Manager - {this.props.title}</h1>
          </div>
        </div>
        <div style={styles.canvas}>
          <div className='CardLists scrollbar' style={styles.cardLists} ref="cardLists" data-scrollable="true">
            {questionSets}
            <div style={styles.createList} onClick={this.showQuestionSetForm.bind(this)}>
              <span>Add a new lecture...</span>
            </div>
          </div>
        </div>
        <Modal isOpen={this.state.modalIsOpen} className='Modal--addCourse'>
          <form>
            <input type="text" value={this.state.newQuestionSetTitle} onChange={this.onQuestionSetInputChange.bind(this)}/>
            <button type="submit" onClick={this.addNewQuestionSet.bind(this)}>Add Lecture</button>
            <button onClick={this.hideQuestionSetForm.bind(this)}>Close</button>
          </form>
        </Modal>
      </div>
    );
  }
}

class CardList extends React.Component {

  constructor() {
    this.state = {
      newQuestion: '',
      modalIsOpen: false,
    };
  }

  showQuestionForm() {
    this.setState({modalIsOpen: true});
    event.preventDefault();
  }

  hideQuestionForm() {
    this.setState({modalIsOpen: false});
    event.preventDefault();
  }

  onQuestionInputChange(event) {
    this.setState({newQuestion: event.target.value});
  }

  addNewQuestion(event) {
    this.props.onAddQuestion(this.props.questionSetKey, this.state.newQuestion);
    this.setState({modalIsOpen: false, newQuestion: ''});
    event.preventDefault();
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
      add: {
        marginTop: '12px',
        cursor: 'pointer',
        minHeight: '20px',
        color: '#999',
        lineHeight: '18px',
        padding: '6px 8px 4px',
      },
    };

    let questions;
    if (this.props.questionSet.questions) {
      questions = this.props.questionSet.questions.map((question, id) => {
        return (
          <Card
            questionSetKey={this.props.questionSetKey}
            questionId={id}
            question={question}
            onRemoveQuestion={this.props.onRemoveQuestion}
          />
        );
      });
    }

    return (
      <div className='CardList' style={styles.cardList} draggable="true">
        <h2>{this.props.questionSet.title}</h2>
        {questions}
        <div onClick={this.showQuestionForm.bind(this)} style={styles.add}>Add a new question</div>
        <Modal isOpen={this.state.modalIsOpen} className='Modal--addCourse'>
          <form>
            <input type="text" value={this.state.newQuestion} onChange={this.onQuestionInputChange.bind(this)}/>
            <button type="submit" onClick={this.addNewQuestion.bind(this)}>Add Question</button>
            <button type="submit" onClick={this.hideQuestionForm.bind(this)}>Close</button>
          </form>
        </Modal>
      </div>
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
      closeButton: {
        width: 15,
        height: 15,
        flex: '15px 0 0',
        fontSize: 8,
        padding: 0,
      }
    };
  }

  onRemoveQuestion(event) {
    this.props.onRemoveQuestion(this.props.questionSetKey, event.currentTarget.dataset.id);
  }

  render() {
    return (
      <div className="Card" style={this.styles.card} draggable="true">
        {this.props.question}
        <button
          className=""
          onClick={this.onRemoveQuestion.bind(this)}
          data-id={this.props.questionId}
          style={this.styles.closeButton}>
          X
        </button>
      </div>
    );
  }
}

export default QuestionManager;
