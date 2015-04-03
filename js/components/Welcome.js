import React from 'react';
import { Link } from 'react-router';

import Header from './Header.js';
import { Button } from './UI.js';
let Firebase = require('firebase');
let Modal = require('react-modal');
require('../../css/components/Button.scss');

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
      composerIsOpen: false,
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
  showForm(event) { this.setState({ modalIsOpen: true }); }

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

  openModal() { this.setState({ modalIsOpen: true }); }
  closeModal() { this.setState({ modalIsOpen: false }); }

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
      return (<SubjectListItem to='questionManager' courseId={val}>{val}</SubjectListItem>);
    });

    return (
      <Grid className="SubjectList">
        <Cell style={cellStyle}>
          {items}
          <div className="ListItem ListItem--outline" onClick={this.showForm}>
            <i className='Icon--plus'></i>Add New
          </div>
        </Cell>
        <Modal isOpen={this.state.modalIsOpen} className='Modal--addCourse'>
          <form>
            <input type="text" value={this.state.newCourse} onChange={this.onCourseInputChange} />
            <button type="submit" onClick={this.addNewCourse}>Add Course</button>
          </form>
          <button onClick={this.closeModal}>Close</button>
        </Modal>
        <div>
          <button className='Button' onClick={this.openComposer.bind(this)}>Open Composer</button>
        </div>
        <QuestionComposer
          isOpen={this.state.composerIsOpen}
          save={this.saveComposerComposition.bind(this)}
          close={this.closeComposer.bind(this)}/>
      </Grid>
    );
  }

  openComposer() {
    this.setState({ composerIsOpen: true });
  }
  saveComposerComposition() {
    this.setState({ composerIsOpen: false });
  }
  closeComposer() {
    this.setState({ composerIsOpen: false });
  }
}

class Welcome extends React.Component {
  render() {
    return (
      <div className='Welcome'>
        <div className='Marquee'>
          <h1 className='Heading'>Welcome, Lecturer.</h1>
          <div className="Subheading">Select the course the questions are for below, or add a new course.</div>
        </div>
        <SubjectList/>
      </div>
    );
  }
}

// A component that allows a lecturer to compose a new question, or to edit
// and existing one.
class QuestionComposer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: ''
    };
  }

  textareaChange(event) {
    let inputText = event.target.value;
    let inputHasText = true;
    if (inputText.length === 0) inputHasText = false;
    this.setState({
      question: event.target.value,
      inputHasText: inputHasText,
    });
  }

  render() {
    let labelClass = 'TransparentLabel';
    if (this.state.inputHasText) labelClass += ' TransparentLabel--hidden';

    return (
      <Modal className='Modal--questionComposer' isOpen={this.props.isOpen}>
        <a onClick={this.props.close} href="#" className='Modal__cross'>&times;</a>
        <div className='AdvancedInput'>
          <div className={labelClass}>Enter Question Here</div>
          <textarea onChange={this.textareaChange.bind(this)} value={this.state.question} />
        </div>
        <a href="#">Insert supporting image &rarr;</a>
        <div className='Modal__footer'>
          <Button onClick={this.props.save}>Save Question</Button>
        </div>
      </Modal>
    );
  }
}

export default Welcome;
