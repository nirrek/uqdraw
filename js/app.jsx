import 'babel-polyfill';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Firebase from 'firebase';
import { GatewayProvider, GatewayDest } from 'react-gateway';
import ReactModal from 'react-modal2';
import config from './config.js';
import SubjectManager from './components/SubjectManager/SubjectManager.jsx';
import QuestionManager from './components/QuestionManager/QuestionManager.jsx';
import Presenter from './components/Presenter/Presenter.jsx';
import Answer from './components/Answer/Answer.jsx';
import Login from './components/Login/Login.jsx';
import Archive from './components/Archive/Archive.jsx';
import Responses from './components/Responses/Responses.jsx';
import '../styles/main.scss';
import '../node_modules/normalize.css/normalize.css';
import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import rootReducer from './reducers/rootReducer.js';
import rootSaga from './sagas/rootSaga.js';
import { setStore } from './utils/API.js';

// a11y for ReactModal: what to hide from screenreader when modal is open.
ReactModal.getApplicationElement = () => document.querySelector('.AppContent');

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
        <div className="AppContent"> {/* extra div for a11y w/ modal */}
          {React.cloneElement(
            this.props.children,
            { // Shallow merge in this extra props object
              ...this.state,
              onChangeCourse: this.onChangeCourse
            }
          )}
        </div>
        <GatewayDest name="modal" />
      </div>
    );
  }
}

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(createSagaMiddleware(rootSaga)),
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
  )
);

if (module.hot) {
  module.hot.accept('./reducers/rootReducer.js', () => {
    const nextRootReducer = require('./reducers/rootReducer.js').default;
    store.replaceReducer(nextRootReducer);
  });
}

setStore(store);

// TODO remove
window.store = store;

const query = `
  query {
    presentation(id:"28fcbaee-71a6-4f4b-99bf-58619396a59c") {
      id,
      startedAt,
      currentQuestion {
        id,
        text,
        lectureOwner {
          id,
          name,
          courseOwner {
            name,
            lectures {
              id,
              name
            }
          }
        }
      }
      responses {
        id,
        responseUri
      }
    }
  }
`;



class Test extends Component {
  componentWillMount() {
  }

  render() {
    return (
      <div>Test</div>
    );
  }
}


render(
  <Provider store={store}>
    <GatewayProvider>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <Route path="/:courseName/question-manager" component={QuestionManager} />
          <Route path="/welcome/:userId" component={SubjectManager} />
          <Route path="/presentation/:code" component={Answer} />
          <Route path="/:courseName/:lectureId" component={Presenter} />
          <Route path="/archive" component={Archive} />
          <Route path="/responses" component={Responses} />
          <Route path="/test" component={Test} />
          <IndexRoute component={Login}/>
        </Route>
      </Router>
    </GatewayProvider>
  </Provider>,
  document.querySelector('#react')
);

