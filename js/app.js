import React from 'react';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

import config from './config.js';
import Header from './components/Header.js';
import Welcome from './components/Welcome';
import QuestionManager from './components/QuestionManager';
import Presenter from './components/Presenter';
import Drawing from './components/Drawing.js';
import StartView from './components/StartView.js';
import Archive from './components/Archive.js';
import Responses from './components/Responses.js';
let Firebase = require('firebase');

class App extends React.Component {
  constructor() {
    this.state = {
      userId: 'uqjstee8',
      courseId: undefined,
      courseName: undefined,
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
      this.setState({courseId: courseId, courseName: courseName});
    }
  }

  render() {
    return (
      <div className="App">
        <RouteHandler {...this.state} onChangeCourse={this.onChangeCourse} routeParams={this.props.routeParams}/>
      </div>
    );
  }
}

// These define the routes for the application. The particular route that
// matches will lead to the handler component being recursivley rendered
// and the resultant tree being mounted to where <RouteHandler/> appears in
// the App component above (line 12 atm).
let routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="questionManager" handler={QuestionManager} path="/:courseName/question-manager"/>
    <Route name="presenter" handler={Presenter} path="/:courseName/:lectureId"/>
    <Route name="drawing" handler={Drawing} path="/drawing"/>
    <Route name="welcome" handler={Welcome} path="/welcome" />
    <Route name="archive" handler={Archive} path="/archive" />
    <Route name="responses" handler={Responses} path="/responses" />
    <DefaultRoute handler={StartView}/>
  </Route>
);

Router.run(routes, function(Handler, state) {
  React.render(<Handler routeParams={state.params}/>, document.querySelector('#react'));
});
