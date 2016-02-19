import 'babel-polyfill';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Firebase from 'firebase';
import config from './config.js';
import Welcome from './components/Welcome.jsx';
import QuestionManager from './components/QuestionManager.jsx';
import Presenter from './components/Presenter.jsx';
import Answer from './components/Answer.jsx';
import StartView from './components/StartView.jsx';
import Archive from './components/Archive.jsx';
import Responses from './components/Responses.jsx';
import '../css/main.css';
import '../node_modules/normalize.css/normalize.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userId: 'uqjstee8',
      courseId: undefined,
      courseName: undefined,
      activeQuestionKey: undefined,
    };
    this.onChangeCourse = this.onChangeCourse.bind(this);
  }

  onChangeCourse(courseId, courseName) {
    if (!courseId && courseName) {
      let ref = new Firebase(config.firebase.base + '/courseLists/' + this.state.userId);
      ref.orderByValue().equalTo(courseName).once('value', (snapshot) => {
        let content = snapshot.val();
        let firstKey = Object.keys(content)[0];
        this.setState({courseId: firstKey, courseName: content[firstKey]});
      });
    } else {
      this.setState({ courseId, courseName });
    }
  }

  render() {
    return (
      <div className="App">
        {React.cloneElement(
          this.props.children,
          { // Shallow merge in this extra props object
            ...this.state,
            onChangeCourse: this.onChangeCourse
          }
        )}
      </div>
    );
  }
}

render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/:courseName/question-manager" component={QuestionManager} />
      <Route path="/welcome/:userId" component={Welcome} />
      <Route path="/:courseName/:lectureId" component={Presenter} />
      <Route path="/drawing" component={Answer} />
      <Route path="/archive" component={Archive} />
      <Route path="/responses" component={Responses} />
      <IndexRoute component={StartView}/>
    </Route>
  </Router>,
  document.querySelector('#react')
);
