import React from 'react';
import { Link } from 'react-router';

import Header from './Header.js';
let Firebase = require('firebase');

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
      <Link className='ListItem' to={this.props.to}>
        {this.props.children}
      </Link>
    );
  }
}

// Don't use ES6 class here as Mixin support has been dropped.
let SubjectList = React.createClass({
  getInitialState: function() {
    return {
      courseLists: [],
      showForm: false,
      newCourse: '', // populated by the 'add course' model input
    };
  },

  componentDidMount() {
    // IDEA /courseLists is an implicit coupling to the api structure
    // Should this be abstracted out somewhere, rather than having implicit
    // coupling spread around the system?
    let ref = this.ref = new Firebase(FIREBASE_ROOT + '/courseLists/uqjstee8');
    ref.on('value', (snapshot) => {
      var content = snapshot.val(); // must unwrap the snapshot
      var courseLists = Object.keys(content).map((key) => content[key]);
      this.setState({ courseLists: courseLists });
    });
  },

  componentWillUnmount() {
    this.ref.off(); // unbind any callbacks
  },

  // Click handler for adding a new course button.
  showForm(event) { this.setState({ showForm: true }); },

  addNewCourse(event) {
    console.log(this.state.newCourse);
    this.ref.push(this.state.newCourse);
    this.setState({
      showForm: false,
      newCourse: '',
    });
    event.preventDefault();
  },

  onCourseInputChange(event) {
    this.setState({ newCourse: event.target.value });
  },

  render: function() {
    // Style for the SubjectList containing cell
    let cellStyle = {
      maxWidth: 610,
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
    };

    var items = this.state.courseLists.map((val) => {
      return (<SubjectListItem to='questionManager'>{val}</SubjectListItem>);
    });

    if (this.state.showForm) {
      var form = (
        <form>
          <input type="text" value={this.state.newCourse} onChange={this.onCourseInputChange} />
          <button type="submit" onClick={this.addNewCourse}>Add Course</button>
        </form>
      );
    }

    return (
      <Grid className="SubjectList">
        <Cell style={cellStyle}>
          {items}
          <div className="ListItem ListItem--outline" onClick={this.showForm}>
            <i className='Icon--plus'></i>Add New
          </div>
        </Cell>
        {form}
      </Grid>
    );
  }
});

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

export default Welcome;
