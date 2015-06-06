import React from 'react';

import Header from './Header.jsx';
import SubjectList from './SubjectList.jsx';
require('../../css/components/WelcomeView.scss');

class Welcome extends React.Component {
  render() {
    return (
      <div className='RouteContainer'>
        <Header />
        <div className='Welcome'>
          <div className='Marquee'>
            <h1 className='Marquee-Heading'>Welcome, Lecturer.</h1>
            <div className="Marquee-Subheading">Select the course the questions are for below, or add a new course.</div>
          </div>
          <SubjectList onChangeCourse={this.props.onChangeCourse}/>
        </div>
      </div>
    );
  }
}
Welcome.propTypes = {
  onChangeCourse: React.PropTypes.func,
};

export default Welcome;
