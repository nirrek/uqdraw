import React, { Component, PropTypes } from 'react';
import '../../../styles/components/Form.scss';  // TODO bad form
import './SubjectList.scss';
import Button from '../Button/Button.jsx';
import Modal, { ModalContent, ModalFooter } from '../Modal/Modal.jsx';
import FlatButton from '../FlatButton/FlatButton.jsx';
import Input from '../Input/Input.jsx';

export default class SubjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      modalIsOpen: false,
    };

    this.showAddCourseModal = this.showAddCourseModal.bind(this);
    this.hideAddCourseModal = this.hideAddCourseModal.bind(this);
    this.addNewCourse = this.addNewCourse.bind(this);
    this.updateCourseInput = this.updateCourseInput.bind(this);
    this.updateOnEnter = this.updateOnEnter.bind(this);
  }

  showAddCourseModal() {
    this.setState({ modalIsOpen: true });
  }

  hideAddCourseModal() {
    this.setState({ modalIsOpen: false });
  }

  updateCourseInput(event) {
    this.setState({ inputText: event.target.value });
  }

  addNewCourse() {
    this.props.onAddSubject(this.state.inputText);

    this.setState({
      modalIsOpen: false,
      inputText: '',
    });
  }

  updateOnEnter(event) {
    if (event.key === 'Enter')
      this.addNewCourse();
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
        <Modal isOpen={this.state.modalIsOpen} onClose={this.hideAddCourseModal}>
          <ModalContent>
            <Input placeholder='Course Name'
                   value={this.state.inputText}
                   onChange={this.updateCourseInput}
                   onKeyDown={this.updateOnEnter}/>
          </ModalContent>
          <ModalFooter>
            <FlatButton type='secondary' onClick={this.hideAddCourseModal}>
              Close
            </FlatButton>
            <FlatButton onClick={this.addNewCourse}>
              Add Course
            </FlatButton>
          </ModalFooter>
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
