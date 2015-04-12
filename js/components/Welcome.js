import React from 'react';
import { Link } from 'react-router';

import Header from './Header.js';
import { Button } from './UI.js';
let Firebase = require('firebase');
let Modal = require('react-modal');
require('../../css/components/Button.scss');
require('../../css/components/WelcomeView.scss');
require('../../css/components/Form.scss');

// React Modal Setup
var appElement = document.getElementById('react');
Modal.setAppElement(appElement);
Modal.injectCSS();

// Should have some sort of configuration module for this stuff
const FIREBASE_ROOT = 'https://uqdraw.firebaseio.com';

class Grid extends React.Component {
  render() {
    var style = this.props.style || {};
    var classes = this.props.className || '';
    classes += ' Grid';
    if (this.props.center) classes += ' Grid--center';
    if (this.props.gutters) classes += ' Grid--gutters';
    return (
      <div style={style} className={classes}>
        {this.props.children}
      </div>
    );
  }
}

class Cell extends React.Component {
  render() {
    var style = this.props.style || {};
    var classes = this.props.className || '';
    classes += ' Grid-cell';
    if (this.props.center) classes += ' Grid-cell--center';
    if (this.props.bottom) classes += ' Grid-cell--bottom';
    return (
      <div style={style} className={classes}>
        {this.props.children}
      </div>
    );
  }
}

class SubjectListItem extends React.Component {
  render() {
    return (
      <Link className='ListItem' to={this.props.to} params={{courseId: this.props.courseId}}>
        {this.props.children}
      </Link>
    );
  }
}

// Don't use ES6 class here as Mixin support has been dropped.
class SubjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseLists: [],
      showForm: false,
      newCourse: '', // populated by the 'add course' model input
      modalIsOpen: false,
    };
  }

  componentDidMount() {
    let ref = this.ref = new Firebase(FIREBASE_ROOT + '/courseLists/uqjstee8');
    ref.on('value', (snapshot) => {
      var content = snapshot.val(); // must unwrap the snapshot
      var courseLists = Object.keys(content).map((key) => content[key]);
      this.setState({ courseLists: courseLists });
    });
  }

  componentWillUnmount() {
    this.ref.off(); // unbind any callbacks
  }

  // Click handler for adding a new course button.
  showForm(event) {
    this.setState({ modalIsOpen: true }, () => {
      // hack to focus the input, for some reason the react-modal destroys
      // any ref attribute inside it, so we cant use that. no time to debug it.
      document.querySelector('.Input').focus();
    });
  }

  addNewCourse(event) {
    console.log(this.state.newCourse);
    this.ref.push(this.state.newCourse);
    this.setState({
      modalIsOpen: false,
      newCourse: '',
    });
    event.preventDefault();
  }

  onCourseInputChange(event) {
    this.setState({ newCourse: event.target.value });
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }
  closeModal(event) {
    event.preventDefault();
    this.setState({ modalIsOpen: false });
  }

  render() {
    // Style for the SubjectList containing cell
    let cellStyle = {
      maxWidth: 610,
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
    };

    var items = this.state.courseLists.map((val) => {
      return (<SubjectListItem key={val} to='questionManager' courseId={val}>{val}</SubjectListItem>);
    });

    return (
      <Grid className="SubjectList">
        <Cell style={cellStyle}>
          {items}
          <div key='addNew' className="ListItem ListItem--outline" onClick={this.showForm.bind(this)}>
            <i className='Icon--plus'></i>Add New
          </div>
        </Cell>
        <Modal isOpen={this.state.modalIsOpen} className='Modal--addCourse'>
          <form ref='Form'>
            <div className='Slat'>
              <input placeholder='Course Name' className='Input' type="text" value={this.state.newCourse} onChange={this.onCourseInputChange.bind(this)} />
            </div>
            <div className='Slat'>
              <button className='Button Button--secondary' type="submit" onClick={this.addNewCourse.bind(this)}>Add Course</button>
            </div>
          </form>
          <a href="" className='Modal__cross' onClick={this.closeModal.bind(this)}>&times;</a>
        </Modal>
      </Grid>
    );
  }
}

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
          <SubjectList/>
        </div>
      </div>
    );
  }
}

export default Welcome;
