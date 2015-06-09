import React from 'react';

import Header from './Header.jsx';
import SubjectList from './SubjectList.jsx';
require('../../css/components/WelcomeView.scss');

import SubjectActions from '../actions/SubjectActions.js';
import SubjectStore from '../stores/SubjectStore.js';

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: SubjectStore.getAll(), // list of subject names
    };

    // Ensure the receiver for the various callbacks is the current object.
    this.onSubjectChange = this.onSubjectChange.bind(this);
  }

  componentDidMount() {
    SubjectStore.addChangeListener(this.onSubjectChange);
  }

  componentWillUnmount() {
    SubjectStore.removeChangeListener(this.onSubjectChange);
  }

  onSubjectChange() {
    this.setState({ subjects: SubjectStore.getAll() });
  }

  // Callback to be passed to SubjectList child
  onAddSubject(subjectName) {
    SubjectActions.create(subjectName);
  }

  render() {
    let testSubjects = this.state.subjects.map((subject) => {
      return (
        <div>
          {subject}
        </div>
      );
    });

    return (
      <div className='RouteContainer'>
        <Header />
        <div className='Welcome'>
          <div className='Marquee'>
            <h1 className='Marquee-Heading'>Welcome, Lecturer.</h1>
            <div className="Marquee-Subheading">Select the course the questions are for below, or add a new course.</div>
          </div>
          <div className='TestSubjects'>
            {testSubjects}
          </div>
          <SubjectList
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
