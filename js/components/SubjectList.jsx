import React from 'react';
import config from '../config';
import { Link } from 'react-router';

let Firebase = require('firebase');
let Modal = require('react-modal');
require('../../css/components/Button.scss');
require('../../css/components/WelcomeView.scss');
require('../../css/components/Form.scss');

// React Modal Setup
let appElement = document.getElementById('react');
Modal.setAppElement(appElement);
Modal.injectCSS();

class SubjectListItem extends React.Component {
  onChangeCourse(courseId, courseName) {
    this.props.onChangeCourse(courseId, courseName);
  }

  render() {
    return (
      <Link
        className='ListItem'
        to={this.props.to}
        params={{courseName: this.props.courseName}}
        onClick={this.onChangeCourse.bind(this, this.props.courseId,
        this.props.courseName)}
      >
        {this.props.children}
      </Link>
    );
  }
}
SubjectListItem.propTypes = {
  to: React.PropTypes.string,
  courseName: React.PropTypes.string,
  courseId: React.PropTypes.string,
  children: React.PropTypes.node,
  onChangeCourse: React.PropTypes.func,
};

class SubjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseLists: {},
      showForm: false,
      newCourse: '', // populated by the 'add course' model input
      modalIsOpen: false,
    };
  }

  componentDidMount() {
    let firebaseEndpoint = config.firebase.base + '/courseLists/uqjstee8';
    let ref = this.ref = new Firebase(firebaseEndpoint);
    ref.on('value', (snapshot) => {
      this.setState({ courseLists: snapshot.val() });
    });
  }

  componentWillUnmount() {
    // unbind any Firebase callbacks
    this.ref.off();
  }

  // Click handler for adding a new course button.
  showForm() {
    this.setState({ modalIsOpen: true }, () => {
      // hack to focus the input, for some reason the react-modal destroys
      // any ref attribute inside it, so we cant use that. no time to debug it.
      document.querySelector('.Input').focus();
    });
  }

  addNewCourse(event) {
    this.props.onAddSubject(this.state.newCourse);

    // this.ref.push(this.state.newCourse);

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

    var items = Object.keys(this.state.courseLists).map((key) => {
      return (
        <SubjectListItem
          key={key}
          to='questionManager'
          courseId={key}
          courseName={this.state.courseLists[key]}
          onChangeCourse={this.props.onChangeCourse}
        >
          {this.state.courseLists[key]}
        </SubjectListItem>);
    });

    return (
      <div className='Grid SubjectList'>
        <div className='Cell' style={cellStyle}>
          {items}
          <div key='addNew' className='ListItem ListItem--outline' onClick={this.showForm.bind(this)}>
            <i className='Icon--plus'></i>Add New
          </div>
        </div>
        <Modal isOpen={this.state.modalIsOpen} className='Modal--addCourse'>
          <form ref='Form'>
            <div className='Slat'>
              <input placeholder='Course Name' className='Input' type='text' value={this.state.newCourse} onChange={this.onCourseInputChange.bind(this)} />
            </div>
            <div className='Slat'>
              <button className='Button Button--secondary' type='submit' onClick={this.addNewCourse.bind(this)}>Add Course</button>
            </div>
          </form>
          <a href='' className='Modal__cross' onClick={this.closeModal.bind(this)}>&times;</a>
        </Modal>
      </div>
    );
  }
}
SubjectList.propTypes = {
  onChangeCourse: React.PropTypes.func,
};

export default SubjectList;