import React from 'react';
import Question from './Question.jsx';
import {Button} from './UI.jsx';
let Modal = require('react-modal');
require('../../css/components/QuestionManager.scss');

class LectureComposer extends React.Component {
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
            <button className='Button Button--secondary' type="submit" onClick={this.onSave.bind(this)}>Add Lecture</button>
          </div>

      </Modal>
    );
  }
}

LectureComposer.propTypes = {
    onSave: React.PropTypes.func,
    isOpen: React.PropTypes.func,
    onClose: React.PropTypes.func,
};

export default LectureComposer;
