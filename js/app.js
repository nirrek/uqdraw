import React from 'react';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

import Welcome from './components/Welcome';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <RouteHandler/>
      </div>
    );
  }
}

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

// Component hierarch ;) - everything is a component
let routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="questionManager" handler={QuestionManager}/>
    <DefaultRoute handler={Welcome}/>
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler/>, document.querySelector('#react'));
});
