import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';
import '../../../css/components/WelcomeView.scss'; // TODO bad form
import '../../../css/components/Form.scss';  // TODO bad form
import './SubjectList.scss';
import Button from '../Button/Button.jsx';

// React Modal Setup
let appElement = document.getElementById('react');
Modal.setAppElement(appElement);
Modal.injectCSS();

export default class SubjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      newCourse: '', // populated by the 'add course' model input
      modalIsOpen: false,
    };

    this.showAddCourseModal = this.showAddCourseModal.bind(this);
    this.hideAddCourseModal = this.hideAddCourseModal.bind(this);
    this.addNewCourse = this.addNewCourse.bind(this);
    this.updateCourseInput = this.updateCourseInput.bind(this);
  }

  showAddCourseModal() {
    this.setState({ modalIsOpen: true });
  }

  hideAddCourseModal(event) {
    event.preventDefault();
    this.setState({ modalIsOpen: false });
  }

  updateCourseInput(event) {
    this.setState({ newCourse: event.target.value });
  }

  addNewCourse(event) {


    this.props.onAddSubject(this.state.newCourse);

    this.setState({
      modalIsOpen: false,
      newCourse: '',
    });
    event.preventDefault();
  }

  focusInputRef(ref) {
    if (!ref) return;
    // Modal componentDidUpdate will focus the form, put the input focus effect
    // on the task queue so that we focus the input after this occurs.
    setTimeout(_ => ref.focus());
  }

  render() {
    const { subjects, onChangeCourse } = this.props;

    const handleSubjectItemClick = (courseId, courseName) => {
      this.context.router.push(`/${courseName}/question-manager`);
      onChangeCourse(courseId, courseName);
    }

    const renderedSubjects = Object.entries(subjects)
      .map(([courseId, courseName]) => (
        <a key={courseId}
           className='ListItem'
           onClick={() => handleSubjectItemClick(courseId, courseName)}>
          {courseName}
        </a>
      ));

    return (
      <div className='Grid SubjectList'>
        <div className='SubjectList-cell'>
          {renderedSubjects}
          <a key='add'
             className='ListItem ListItem--outline'
             onClick={this.showAddCourseModal}>
            <i className='Icon--plus'></i>Add New
          </a>
        </div>
        <Modal isOpen={this.state.modalIsOpen} className='Modal--addCourse'>
          <div className='Slat'>
            <input ref={this.focusInputRef} placeholder='Course Name' className='Input' type='text' value={this.state.newCourse} onChange={this.updateCourseInput} />
          </div>
          <div className='Slat'>
            <Button type='secondary' onClick={this.addNewCourse}>
              Add Course
            </Button>
          </div>
          <a href='' className='Modal__cross' onClick={this.hideAddCourseModal}>&times;</a>
        </Modal>
      </div>
    );
  }
}

SubjectList.propTypes = {
  subjects: PropTypes.object,
  onChangeCourse: PropTypes.func,
};

SubjectList.contextTypes = {
  router: PropTypes.object,
};
