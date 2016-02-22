import React, { Component } from 'react';
import Button from '../Button/Button.jsx';
import Modal, { ModalFooter, ModalContent } from '../Modal/Modal.jsx';
import FlatButton from '../FlatButton/FlatButton.jsx';
import Input from '../Input/Input.jsx';
import './LectureComposer.scss';

export default class LectureComposer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.addLectureOnEnter = this.addLectureOnEnter.bind(this);
  }

  onInputChange(event) {
    this.setState({ inputText: event.target.value });
  }

  onSave() {
    this.props.onSave(this.state.inputText);
    this.setState({ inputText: '' });
  }

  addLectureOnEnter(event) {
    if (event.key === 'Enter')
      this.onSave();
  }

  render() {
    const { isOpen, onClose } = this.props;

    return (
      <Modal isOpen={isOpen} onClose={onClose} hasCloseButton={false}>
        <ModalContent>
          <div className='LectureCompose-inputContainer'>
            <Input placeholder='Lecture Name'
                   value={this.state.inputText}
                   onChange={this.onInputChange}
                   onKeyDown={this.addLectureOnEnter}/>
          </div>
        </ModalContent>
        <ModalFooter>
          <FlatButton type="secondary" onClick={onClose}>
            Close
          </FlatButton>
          <FlatButton type="primary" onClick={this.onSave}>
            Add Lecture
          </FlatButton>
        </ModalFooter>
      </Modal>
    );
  }
}

LectureComposer.propTypes = {
  onSave: React.PropTypes.func,
  isOpen: React.PropTypes.bool,
  onClose: React.PropTypes.func,
};
