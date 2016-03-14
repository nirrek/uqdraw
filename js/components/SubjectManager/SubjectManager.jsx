import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSubject } from '../../actions/SubjectActions.js';
import { fetchUser } from '../../actions/UserActions.js';
import Header from '../Header/Header.jsx';
import SubjectList from '../SubjectList/SubjectList.jsx';
import './SubjectManager.scss'

class SubjectManager extends Component {
  constructor(props) {
    super(props);

    // Fetch our data.
    // TODO should be fired on login action as part of login.
    this.userId = '8c0287c9-af07-45e4-a844-dd19254860b5'; // temp
    props.fetchUser(this.userId);

    this.onAddSubject = this.onAddSubject.bind(this);
  }

  onAddSubject(subjectName) {
    if (subjectName === '') return; // TODO trigger validation notification
    const { routeParams, createSubject } = this.props;
    createSubject(this.userId, subjectName);
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
            subjects={this.props.subjects}
            onAddSubject={this.onAddSubject}
            onChangeCourse={this.props.onChangeCourse}
          />
        </div>
      </div>
    );
  }
}

SubjectManager.propTypes = {
  subjects: PropTypes.object,
  createSubject: PropTypes.func,
  fetchUser: PropTypes.func,
};

export default connect(
  (state) => ({
    subjects: state.subjects.subjects
  }),
  {
    createSubject,
    fetchUser
  }
)(SubjectManager);
