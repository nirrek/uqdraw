import React from 'react';
import { Link } from 'react-router';

class CardList extends React.Component {

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
        fontSize: '14px',
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
    };

    var createCard = function(item) {
      return <div className="Card" style={styles.card}>{item.title}</div>;
    };

    return (
      <div className='CardList' style={styles.cardList}>
        <h2>{this.props.questionSet.title}</h2>
        {this.props.questionSet.questions.map(createCard)}
      </div>
    );
  }
}

class QuestionManager extends React.Component {
  constructor(props) {
   super(props);
    this.state = {
      questionSets: [
        {
          title: 'Lecture 1',
          questions: [
            {title: 'How tall are you?'},
            {title: 'How old are you?'}
          ]
        },
        {
          title: 'Lecture 2',
          questions: [
            {title: 'What is your name?'},
            {title: 'What is your favourite colour?'}
          ]
        },
        {
          title: 'Lecture 3',
          questions: [
            {title: 'Some question?'},
            {title: 'Another question?'}
          ]
        },
        {
          title: 'Lecture 4',
          questions: [
            {title: 'Wwwop?'},
            {title: 'Woosh?'}
          ]
        },
        {
          title: 'Lecture 5',
          questions: [
            {title: 'karar?'},
            {title: 'peshisha?'}
          ]
        },
      ],
      curYPos: 0,
      curXPos: 0,
      curScrollPos: 0,
      curDown: false,
      curOffset: 0,
    };
  }

  componentDidMount() {
    this.state.node = React.findDOMNode(this.refs.cardLists);
  }

  mouseMove(e) {
    if(this.state.curDown === true){
      // this.state.node.scrollTo(this.state.node.scrollLeft + (this.state.curXPos - e.pageX), this.state.node.scrollTop + (this.state.curYPos - e.pageY));
      var node = this.state.node,
        offset = this.state.curXPos - e.pageX,
        scrollLeft = node.scrollLeft,
        maxScroll = node.scrollWidth - node.clientWidth;

      // Stop measuring negative offsets once scroll is 0
      if (scrollLeft <= 0 && offset < 0) {
        this.state.curScrollPos = 0;
        this.state.curXPos = e.pageX;
      }
      // Stop measuring positive offsets once max scroll is reached
      else if (scrollLeft >= maxScroll && offset > 0) {
        this.state.curScrollPos = maxScroll;
        this.state.curXPos = e.pageX;
      }
      node.scrollLeft = this.state.curScrollPos + offset;
    }
  }

  mouseDown(e) {
    this.state.curDown = true;
    this.state.curXPos = e.pageX;
    this.state.curScrollPos = this.state.node.scrollLeft;
  }

  mouseUp(e) {
    this.state.curDown = false;
  }

  // window.addEventListener('mousedown', function(e){ curDown = true; curYPos = e.pageY; curXPos = e.pageX; });
  // window.addEventListener('mouseup', function(e){ curDown = false; });

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
        color: '#fff'
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
        height: '800px',
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
        webkitUserSelect: 'none',
      },
    }

    var createCardList = function(questionSet) {
      return <CardList questionSet={questionSet}></CardList>;
    };

    return (
      <div className='QuestionManager' style={styles.questionManager} onMouseDown={this.mouseDown.bind(this)} onMouseUp={this.mouseUp.bind(this)} onMouseMove={this.mouseMove.bind(this)}>
        <div className='TitleBar' style={styles.titleBar}>
          <Link to="app" className="TitleBar-link" style={styles.welcomeLink}>Welcome</Link>
          <div className="TitleBar-title" style={styles.title}>
            <h1>Question Manager - {this.props.title}</h1>
          </div>
        </div>
        <div style={styles.canvas}>
          <div className='CardLists scrollbar' style={styles.cardLists} ref="cardLists">
            {this.state.questionSets.map(createCardList)}
            <div style={styles.createList}>
              <span>Add a new lecture...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionManager;
