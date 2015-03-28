import React from 'react';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

import Header from './components/Header.js';
import Welcome from './components/Welcome';
import QuestionManager from './components/QuestionManager';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Header />
        <RouteHandler/>
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
    <Route name="questionManager" handler={QuestionManager}/>
    <DefaultRoute handler={Welcome}/>
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler/>, document.querySelector('#react'));
});
