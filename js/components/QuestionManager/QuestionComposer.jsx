import React, { Component, PropTypes } from 'react';
import FlatButton from '../FlatButton/FlatButton.jsx';
import Modal, { ModalContent, ModalFooter } from '../Modal/Modal.jsx';
import './QuestionComposer.scss';

export default class QuestionComposer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputText: ''
    };

    this.handleTextareaChange = this.handleTextareaChange.bind(this);
    this.saveQuestion = this.saveQuestion.bind(this);
  }

  handleTextareaChange(event) {
    this.setState({ inputText: event.target.value });
  }

  saveQuestion() {
    this.props.onSave(this.state.inputText);
    this.setState({ inputText: '' });
  }

  render() {
    const { isOpen, onClose } = this.props;

    return (
      <Modal isOpen={isOpen} onClose={onClose} hasCloseButton={false}>
        <ModalContent>
          <textarea
            value={this.state.inputText}
            placeholder="Enter question here"
            className='QuestionComposer-input'
            onChange={this.handleTextareaChange} />
        </ModalContent>
        <ModalFooter>
          <FlatButton type='secondary' onClick={onClose}>Close</FlatButton>
          <FlatButton onClick={this.saveQuestion}>Save Question</FlatButton>
        </ModalFooter>
      </Modal>
    );
  }
}

QuestionComposer.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};
