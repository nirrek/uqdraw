import React, { Component } from 'react';
import Modal from './Modal/Modal.jsx';
import Button from './Button/Button.jsx';
import '../../styles/components/QuestionManager.scss';

export default class LectureComposer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onInputChange(event) {
    this.setState({ inputText: event.target.value });
  }

  onSave() {
    this.props.onSave(this.state.inputText);
    this.setState({ inputText: '' });
  }

  render() {
    const { isOpen, onClose } = this.props;

    return (
      <Modal isOpen={isOpen} onClose={onClose} modalStyles={styles.modal}>
        <div className='Slat'>
          <input placeholder='Lecture Name'
                 className='Input'
                 type="text"
                 value={this.state.inputText}
                 onChange={this.onInputChange} />
        </div>
        <div className='Slat'>
          <Button type='secondary' onClick={this.onSave}>
            Add Lecture
          </Button>
        </div>
      </Modal>
    );
  }
}

const styles = {
  modal: { height: 209 }
};

LectureComposer.propTypes = {
  onSave: React.PropTypes.func,
  isOpen: React.PropTypes.bool,
  onClose: React.PropTypes.func,
};
