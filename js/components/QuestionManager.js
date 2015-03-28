import React from 'react';
import { Link } from 'react-router';

class CardList extends React.Component {
  render() {
    var createCard = function(item) {
      return <div className="Card">{item.title}</div>;
    };

    return (
      <div className='CardList'>
        <h2>{this.props.questionSet.title}</h2>
        {this.props.questionSet.questions.map(createCard)}
        <
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
      ]
    };
  }

  render() {
    var createCardList = function(questionSet) {
      return <CardList questionSet={questionSet}></CardList>;
    };

    return (
      <div className='QuestionManager'>
        <div className='TitleBar'>
          <Link to="app" className="TitleBar-link">Welcome</Link>
          <div className="TitleBar-title">
            <h1>Question Manager - {this.props.title}</h1>
          </div>
        </div>

        <div className='CardLists'>
          {this.state.questionSets.map(createCardList)}
        </div>
      </div>
    );
  }
}

export default QuestionManager;
