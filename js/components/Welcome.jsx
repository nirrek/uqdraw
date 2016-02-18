import React, { Component } from 'react';

import Header from './Header.jsx';
import SubjectList from './SubjectList.jsx';
require('../../css/components/WelcomeView.scss');

import SubjectActions from '../actions/SubjectActions.js';
import SubjectStore from '../stores/SubjectStore.js';

import generateComponentKey from '../utils/ComponentKey.js';
import { subscribe, unsubscribe, APIConstants } from '../utils/API.js';

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.componentKey = generateComponentKey();
    this.state = {
      subjects: [], // list of subject names
    };

    // Ensure the receiver for the various callbacks is the current object.
    this.onSubjectChange = this.onSubjectChange.bind(this);
    this.onSubmitChange = this.onSubmitChange.bind(this);
    this.onAddSubject = this.onAddSubject.bind(this);
    this.initData = this.initData.bind(this);
  }

  componentDidMount() {
    // Populate local state from store & setup Firebase observation.
    this.initData();

    // Listen for store changes
    SubjectStore.addChangeListener(this.onSubjectChange);
    SubjectStore.addChangeListener(this.onSubmitChange);
  }

  componentWillReceiveProps(newProps) {
    this.initData(newProps.courseId);
  }

  componentWillUnmount() {
    let userId = this.props.routeParams.userId;
    SubjectStore.removeChangeListener(this.onSubjectChange);
    SubjectStore.removeChangeListener(this.onSubmitChange);
    unsubscribe(APIConstants.subjects, this.componentKey, userId);
  }

  initData() {
    let userId = this.props.routeParams.userId;

    this.setState({
      subjects: SubjectStore.getAll(),
      isSubmitting: SubjectStore.isSubmitting(),
    });
    subscribe(APIConstants.subjects, this.componentKey, userId);
  }

  onSubjectChange() {
    this.setState({ subjects: SubjectStore.getAll() });
  }

  onSubmitChange() {
    this.setState({ isSubmitting: SubjectStore.isSubmitting() });
  }

  // Callback to be passed to SubjectList child
  onAddSubject(subjectName) {
    let userId = this.props.routeParams.userId;
    SubjectActions.create(userId, subjectName);
  }

  render() {
    return (
      <div className='RouteContainer'>
        <Header />
        <div className='Welcome'>
          <div className='Marquee'>
            <h1 className='Marquee-Heading'>Welcome, Lecturer.</h1>
            <div className="Marquee-Subheading">Select the course the questions are for below, or add a new course.</div>
          </div>
          <SubjectList
            subjects={this.state.subjects}
            onAddSubject={this.onAddSubject}
            onChangeCourse={this.props.onChangeCourse}
          />
        </div>
      </div>
    );
  }
}

Welcome.propTypes = {
  onAddSubject: React.PropTypes.func,
  onChangeCourse: React.PropTypes.func,
};

export default Welcome;
