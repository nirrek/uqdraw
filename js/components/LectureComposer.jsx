import React, { Component } from 'react';
let Modal = require('react-modal');
require('../../css/components/QuestionManager.scss');
import Button from './Button/Button.jsx';

export default class LectureComposer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lecture: '',
      inputHasText: false,
    };
  }

  onInputChange(event) {
    let inputText = event.target.value;
    let inputHasText = true;
    if (inputText.length === 0) {inputHasText = false;}
    this.setState({
      lecture: inputText,
      inputHasText: inputHasText
    });
  }

  onSave() {
    this.props.onSave(this.state.lecture);
    this.setState({lecture: '', inputHasText: false});
  }

  render() {
    let {isOpen, onClose} = this.props;
    let labelClass = 'TransparentLabel';
    if (this.state.inputHasText) {labelClass += ' TransparentLabel--hidden'; }

    return (
      <Modal isOpen={isOpen} className='Modal--lectureComposer'>
        <a onClick={onClose} href="#" className='Modal__cross'>&times;</a>
          <div className='Slat'>
            <input placeholder='Lecture Name' className='Input' type="text" value={this.state.lecture} onChange={this.onInputChange.bind(this)} />
          </div>
          <div className='Slat'>
            <Button type='secondary' onClick={this.onSave.bind(this)}>
              Add Lecture
            </Button>
          </div>

      </Modal>
    );
  }
}

LectureComposer.propTypes = {
    onSave: React.PropTypes.func,
    isOpen: React.PropTypes.bool,
    onClose: React.PropTypes.func,
};
