import React from 'react';
import { Link } from 'react-router';

class QuestionManager extends React.Component {
  render() {
    return (
      <div>
        <h1>Question Manager</h1>
        <Link to="app">Welcome</Link>
      </div>
    );
  }
}

export default QuestionManager;
